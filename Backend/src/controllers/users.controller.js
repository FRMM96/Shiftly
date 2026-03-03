const prisma = require('../db/prisma')

exports.listUsers = async (req, res) => {
  try {
    const role = req.query.role
    const where = role ? { role } : {}

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return res.json({ users })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}