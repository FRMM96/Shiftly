const prisma = require("../db/prisma");

function parseDateOnlyToUTC(dateStr) {
  // Accepts YYYY-MM-DD and returns a Date at 00:00:00Z (stable across timezones)
  const [y, m, d] = String(dateStr).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
}

exports.createShift = async (req, res) => {
  try {
    const { business, roleName, date, startTime, endTime, pay, workerId, status } = req.body;

    if (!business || !roleName || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "business, roleName, date, startTime, endTime required" });
    }

    const dt = parseDateOnlyToUTC(date);
    if (!dt) return res.status(400).json({ message: "Invalid date (expected YYYY-MM-DD)" });

    const shift = await prisma.shift.create({
      data: {
        business,
        roleName,
        date: dt,
        startTime,
        endTime,
        pay: pay || null,
        status: status === "OPEN" ? "OPEN" : "ACTIVE",
        managerId: req.user.id,
        workerId: status === "OPEN" ? null : (workerId || null),
      },
      include: {
        worker: { select: { id: true, email: true, username: true } },
      },
    });

    return res.status(201).json({ shift });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listManagerShifts = async (req, res) => {
  try {
    const { from, to } = req.query; // YYYY-MM-DD (optional)
    const where = { managerId: req.user.id };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = parseDateOnlyToUTC(from);
      if (to) {
        // include end date by adding 1 day
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
      where: { workerId: req.user.id, status: { not: "CANCELED" } },
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

    // Authorization: manager can see their shifts; worker can see their assigned shifts
    if (req.user.role === "BOSS" && shift.managerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.user.role === "EMPLOYEE" && shift.workerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
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

    const { business, roleName, date, startTime, endTime, pay, workerId, status } = req.body;

    const data = {};
    if (business !== undefined) data.business = business;
    if (roleName !== undefined) data.roleName = roleName;
    if (startTime !== undefined) data.startTime = startTime;
    if (endTime !== undefined) data.endTime = endTime;
    if (pay !== undefined) data.pay = pay || null;
    if (status !== undefined) data.status = status;
    if (workerId !== undefined) data.workerId = workerId || null;

    if (date !== undefined) {
      const dt = parseDateOnlyToUTC(date);
      if (!dt) return res.status(400).json({ message: "Invalid date (expected YYYY-MM-DD)" });
      data.date = dt;
    }

    // If set OPEN, worker must be null
    if (data.status === "OPEN") data.workerId = null;

    const shift = await prisma.shift.update({
      where: { id },
      data,
      include: {
        worker: { select: { id: true, email: true, username: true } },
      },
    });

    return res.json({ shift });
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
