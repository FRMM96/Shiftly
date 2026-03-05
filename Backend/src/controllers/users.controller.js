const prisma = require("../db/prisma");

exports.listUsers = async (req, res) => {
  try {
    const role = req.query.role; // e.g. EMPLOYEE

    const where = {
      companyId: req.user.companyId,         
      ...(role ? { role } : {})              
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        companyId: true
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};