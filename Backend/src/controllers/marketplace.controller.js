const prisma = require("../db/prisma");

exports.listOpenShifts = async (req, res) => {
  try {
    const shifts = await prisma.shift.findMany({
      where: { status: "OPEN" },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: {
        manager: { select: { id: true, email: true, username: true } },
        applications: {
          where: { userId: req.user.id },
          select: { id: true, status: true },
        },
      },
    });

    return res.json({ shifts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
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

    const application = await prisma.shiftApplication.upsert({
      where: { shiftId_userId: { shiftId: id, userId: req.user.id } },
      update: { status: "PENDING" },
      create: { shiftId: id, userId: req.user.id },
    });

    return res.status(201).json({ application });
  } catch (err) {
    // Prisma unique constraint etc.
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
        user: { select: { id: true, email: true, username: true } },
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
    const { id } = req.params; // shiftId
    const { applicationId } = req.body;

    if (!applicationId) return res.status(400).json({ message: "applicationId required" });

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

    // transaction: accept chosen, reject others, assign shift, set ACTIVE
    const result = await prisma.$transaction(async (tx) => {
      const accepted = await tx.shiftApplication.update({
        where: { id: applicationId },
        data: { status: "ACCEPTED" },
      });

      await tx.shiftApplication.updateMany({
        where: { shiftId: id, id: { not: applicationId }, status: "PENDING" },
        data: { status: "REJECTED" },
      });

      const updatedShift = await tx.shift.update({
        where: { id },
        data: { workerId: application.userId, status: "ACTIVE" },
        include: {
          worker: { select: { id: true, email: true, username: true } },
        },
      });

      return { accepted, shift: updatedShift };
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
