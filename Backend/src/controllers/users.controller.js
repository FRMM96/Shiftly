const prisma = require("../db/prisma");

exports.listUsers = async (req, res) => {
  try {
    // Boss can see employees (and optionally other bosses). Default: employees only.
    const includeBosses = String(req.query.includeBosses || "false") === "true";

    const where = includeBosses ? {} : { role: "EMPLOYEE" };

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, username: true, role: true, createdAt: true },
    });

    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
