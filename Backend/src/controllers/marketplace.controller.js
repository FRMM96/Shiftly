const prisma = require("../db/prisma");
const { createNotification, notifyManagers } = require("../helpers/notification");

exports.listOpenShifts = async (req, res) => {
  const shifts = await prisma.shift.findMany({
    where: { status: "OPEN", companyId: req.user.companyId },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    include: { manager: { select: { id: true, email: true, username: true } } },
  });
  res.json({ shifts });
  try {
    const shifts = await prisma.shift.findMany({
      where: {
        status: "OPEN",
        OR: [
          { visibility: "GLOBAL" },
          { companyId: req.user.companyId, visibility: "COMPANY" },
        ],
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: {
        manager: { select: { id: true, email: true, username: true } },
      },
    });

    res.json({ shifts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.applyToShift = async (req, res) => {
  try {
    if (req.user.role !== "EMPLOYEE") {
      return res.status(403).json({ message: "Only employees can apply" });
    }

    const { id } = req.params;
    const shift = await prisma.shift.findUnique({ where: { id } });

    if (!shift) return res.status(404).json({ message: "Shift not found" });
    if (shift.status !== "OPEN") return res.status(400).json({ message: "Shift is not open" });

    const canApply =
      shift.visibility === "GLOBAL" ||
      (shift.visibility === "COMPANY" && shift.companyId === req.user.companyId);

    if (!canApply) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const application = await prisma.shiftApplication.upsert({
      where: { shiftId_userId: { shiftId: id, userId: req.user.id } },
      update: { status: "PENDING" },
      create: { shiftId: id, userId: req.user.id },
    });

    await notifyManagers(
      shift.companyId,
      'APPLICATION',
      `${req.user.username} applied for ${shift.roleName}`,
      `/manager/applicants/${shift.id}`
    );

    return res.status(201).json({ application });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listApplicants = async (req, res) => {
  try {
    const { id } = req.params;

    const shift = await prisma.shift.findUnique({ where: { id } });
    if (!shift) return res.status(404).json({ message: "Shift not found" });
    if (shift.managerId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const applicants = await prisma.shiftApplication.findMany({
      where: { shiftId: id },
      orderBy: [{ appliedAt: "asc" }],
      include: {
        user: {
          select: { id: true, email: true, username: true, companyId: true },
        },
      },
    });

    return res.json({ applicants });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.assignApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({ message: "applicationId required" });
    }

    const shift = await prisma.shift.findUnique({ where: { id } });
    if (!shift) return res.status(404).json({ message: "Shift not found" });
    if (shift.managerId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const application = await prisma.shiftApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application || application.shiftId !== id) {
      return res.status(404).json({ message: "Application not found for this shift" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const accepted = await tx.shiftApplication.update({
        where: { id: applicationId },
        data: { status: "ACCEPTED" },
      });

      await tx.shiftApplication.updateMany({
        where: {
          shiftId: id,
          id: { not: applicationId },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      });

      const updatedShift = await tx.shift.update({
        where: { id },
        data: {
          workerId: application.userId,
          status: "ACTIVE",
          visibility: shift.visibility === "GLOBAL" ? "GLOBAL" : "COMPANY",
          companyId: shift.visibility === "GLOBAL" ? null : req.user.companyId,
        },
        include: {
          worker: { select: { id: true, email: true, username: true } },
        },
      });

      return { accepted, shift: updatedShift };
    });

    // Notify accepted worker
    await createNotification(
      application.userId,
      shift.companyId,
      'SHIFT_ASSIGNED',
      `You were accepted for ${shift.roleName}`,
      '/worker/calendar'
    );

    // Notify rejected workers
    const rejected = await prisma.shiftApplication.findMany({
      where: { shiftId: id, status: 'REJECTED' },
      select: { userId: true }
    });
    await Promise.all(
      rejected.map(r =>
        createNotification(r.userId, shift.companyId, 'APPLICATION_REJECTED', `Your application for ${shift.roleName} was not selected`, '/worker/marketplace')
      )
    );

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.rejectApplicant = async (req, res) => {
  try {
    const { id, applicationId } = req.params;

    const shift = await prisma.shift.findUnique({ where: { id } });
    if (!shift) return res.status(404).json({ message: "Shift not found" });
    if (shift.managerId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const application = await prisma.shiftApplication.findUnique({
      where: { id: applicationId },
    });
    if (!application || application.shiftId !== id) {
      return res.status(404).json({ message: "Application not found for this shift" });
    }
    if (application.status !== "PENDING") {
      return res.status(400).json({ message: "Only pending applications can be rejected" });
    }

    const rejectedApp = await prisma.shiftApplication.update({
      where: { id: applicationId },
      data: { status: "REJECTED" },
    });

    await createNotification(
      application.userId,
      shift.companyId,
      'APPLICATION_REJECTED',
      `Your application for ${shift.roleName} was not selected`,
      '/worker/marketplace'
    );

    return res.json({ application: rejectedApp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
