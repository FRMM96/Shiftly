const prisma = require("../db/prisma");
const { notifyWorkers } = require("../helpers/notification");

function parseDateOnlyToUTC(dateStr) {
  const [y, m, d] = String(dateStr).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
}

async function assertEmployeeExistsInMyCompany(workerId, companyId) {
  if (!workerId) return null;

  const u = await prisma.user.findUnique({
    where: { id: workerId },
    select: { id: true, role: true, companyId: true, email: true, username: true },
  });

  if (!u) {
    const err = new Error("Worker not found");
    err.statusCode = 400;
    throw err;
  }

  if (u.role !== "EMPLOYEE") {
    const err = new Error("workerId must belong to an EMPLOYEE account");
    err.statusCode = 400;
    throw err;
  }

  if (u.companyId !== companyId) {
    const err = new Error("workerId must belong to your company");
    err.statusCode = 400;
    throw err;
  }

  return u;
}

exports.createShift = async (req, res) => {
  try {
    const { business, roleName, date, startTime, endTime, pay, priority, workerId, status } = req.body;

    if (!business || !roleName || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: "business, roleName, date, startTime, endTime required",
      });
    }

    const dt = parseDateOnlyToUTC(date);
    if (!dt) return res.status(400).json({ message: "Invalid date (expected YYYY-MM-DD)" });

    const validPriorities = ["LOW", "NORMAL", "URGENT"];
    const finalPriority = validPriorities.includes(priority) ? priority : "NORMAL";

    const willBeOpen = status === "OPEN";

    if (hasAssignedWorker) {
      await assertEmployeeExistsInMyCompany(workerId, req.user.companyId);
    }

    const finalVisibility = hasAssignedWorker
      ? "COMPANY"
      : (visibility === "COMPANY" ? "COMPANY" : "GLOBAL");

    const finalStatus = hasAssignedWorker
      ? "ACTIVE"
      : (status === "OPEN" || !status ? "OPEN" : status);

    const shift = await prisma.shift.create({
      data: {
        business,
        location: location || null,
        notes: notes || null,
        roleName,
        date: dt,
        startTime,
        endTime,
        pay: pay || null,
        priority: finalPriority,

        status: willBeOpen ? "OPEN" : "ACTIVE",

        managerId: req.user.id,
        companyId: finalVisibility === "GLOBAL" ? null : req.user.companyId,
        workerId: hasAssignedWorker ? workerId : null,
      },
      include: {
        worker: { select: { id: true, email: true, username: true } },
      },
    });

    if (willBeOpen) {
      await notifyWorkers(
        req.user.companyId,
        'SHIFT_AVAILABLE',
        `New open shift: ${roleName} on ${date}`,
        '/worker/marketplace'
      );
        if (shift.visibility === "GLOBAL" && shift.status === "OPEN") {
      const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        select: { id: true, email: true, username: true }
      })

      if (employees.length > 0) {
        await prisma.notification.createMany({
          data: employees.map(emp => ({
            userId: emp.id,
            type: "GLOBAL_SHIFT_POSTED",
            title: "New global shift posted",
            message: `${shift.roleName} at ${shift.business} on ${new Date(shift.date).toISOString().slice(0, 10)} (${shift.startTime}-${shift.endTime})`,
            link: "/worker/marketplace"
          }))
        })

        for (const emp of employees) {
          sendEmail({
            to: emp.email,
            subject: "New global shift posted",
            text: `A new global shift has been posted.\n\nRole: ${shift.roleName}\nBusiness: ${shift.business}\nDate: ${new Date(shift.date).toISOString().slice(0, 10)}\nTime: ${shift.startTime}-${shift.endTime}\n\nLog in to Shiftly to apply.`,
            html: `
              <h2>New global shift posted</h2>
              <p>A new global shift is available.</p>
              <ul>
                <li><strong>Role:</strong> ${shift.roleName}</li>
                <li><strong>Business:</strong> ${shift.business}</li>
                <li><strong>Date:</strong> ${new Date(shift.date).toISOString().slice(0, 10)}</li>
                <li><strong>Time:</strong> ${shift.startTime}-${shift.endTime}</li>
              </ul>
              <p>Log in to Shiftly to apply.</p>
            `
          }).catch(err => {
            console.error('Email send failed:', err.message)
          })
        }
      }
    }

    return res.status(201).json({ shift });
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({ message: err.message || "Server error" });
  }
};

exports.listManagerShifts = async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = { managerId: req.user.id };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = parseDateOnlyToUTC(from);
      if (to) {
        const end = parseDateOnlyToUTC(to);
        if (end) end.setUTCDate(end.getUTCDate() + 1);
        where.date.lt = end;
      }
    }

    const shifts = await prisma.shift.findMany({
      where,
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: {
        worker: { select: { id: true, email: true, username: true } },
        applications: {
          where: { status: "PENDING" },
          select: { id: true },
        },
      },
    });

    return res.json({ shifts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listMyShifts = async (req, res) => {
  try {
    const shifts = await prisma.shift.findMany({
      where: {
        workerId: req.user.id,
        status: { not: "CANCELED" },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: {
        manager: { select: { id: true, email: true, username: true } },
      },
    });

    return res.json({ shifts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getShift = async (req, res) => {
  try {
    const { id } = req.params;

    const shift = await prisma.shift.findUnique({
      where: { id },
      include: {
        worker: { select: { id: true, email: true, username: true } },
        manager: { select: { id: true, email: true, username: true } },
      },
    });

    if (!shift) return res.status(404).json({ message: "Shift not found" });

    if (req.user.role === "BOSS") {
      if (shift.managerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (req.user.role === "EMPLOYEE") {
      const canSee =
        shift.workerId === req.user.id ||
        (shift.visibility === "GLOBAL" && shift.status === "OPEN") ||
        (shift.companyId === req.user.companyId);

      if (!canSee) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    return res.json({ shift });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateShift = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.shift.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Shift not found" });
    if (existing.managerId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const { business, roleName, date, startTime, endTime, pay, priority, workerId, status } = req.body;

    const data = {};

    if (business !== undefined) data.business = business;
    if (location !== undefined) data.location = location || null;
    if (notes !== undefined) data.notes = notes || null;
    if (roleName !== undefined) data.roleName = roleName;
    if (startTime !== undefined) data.startTime = startTime;
    if (endTime !== undefined) data.endTime = endTime;
    if (pay !== undefined) data.pay = pay || null;
    if (priority !== undefined) {
      const validPriorities = ["LOW", "NORMAL", "URGENT"];
      if (validPriorities.includes(priority)) data.priority = priority;
    }
    if (status !== undefined) data.status = status;

    if (date !== undefined) {
      const dt = parseDateOnlyToUTC(date);
      if (!dt) return res.status(400).json({ message: "Invalid date (expected YYYY-MM-DD)" });
      data.date = dt;
    }

    if (workerId !== undefined) {
      if (workerId) {
        await assertEmployeeExistsInMyCompany(workerId, req.user.companyId);
        data.workerId = workerId;
        data.visibility = "COMPANY";
        data.companyId = req.user.companyId;
        data.status = "ACTIVE";
      } else {
        data.workerId = null;
      }
    }

    if (visibility !== undefined && !data.workerId) {
      const nextVisibility = visibility === "COMPANY" ? "COMPANY" : "GLOBAL";
      data.visibility = nextVisibility;
      data.companyId = nextVisibility === "GLOBAL" ? null : req.user.companyId;
      if (nextVisibility === "GLOBAL" && data.status === undefined) {
        data.status = "OPEN";
      }
    }

    if (data.status === "OPEN" && !data.workerId && data.visibility === undefined) {
      data.visibility = existing.visibility || "GLOBAL";
      data.companyId = data.visibility === "GLOBAL" ? null : req.user.companyId;
    }

    const shift = await prisma.shift.update({
      where: { id },
      data,
      include: {
        worker: { select: { id: true, email: true, username: true } },
      },
    });

    if (shift.status === "OPEN" && existing.status !== "OPEN") {
      await notifyWorkers(
        req.user.companyId,
        'SHIFT_AVAILABLE',
        `New open shift: ${shift.roleName} on ${shift.date.toISOString().split('T')[0]}`,
        '/worker/marketplace'
      );
    }

    return res.json({ shift });
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({ message: err.message || "Server error" });
  }
};

exports.listUserShifts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify the target user is in the same company
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, companyId: true, username: true },
    });
    if (!targetUser || targetUser.companyId !== req.user.companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const shifts = await prisma.shift.findMany({
      where: {
        workerId: userId,
        companyId: req.user.companyId,
        status: { not: "CANCELED" },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      select: { id: true, roleName: true, date: true, startTime: true, endTime: true, business: true },
    });

    return res.json({ shifts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.shift.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Shift not found" });
    if (existing.managerId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    await prisma.shift.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};