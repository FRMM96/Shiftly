const prisma = require("../db/prisma");

exports.listUsers = async (req, res) => {
  try {
    const role = req.query.role;

    const where = {
      companyId: req.user.companyId,
      ...(role ? { role } : {}),
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.companyId !== req.user.companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const shifts = await prisma.shift.findMany({
      where: {
        workerId: id,
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: {
        manager: { select: { id: true, username: true, email: true } },
      },
    });

    return res.json({ user, shifts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};