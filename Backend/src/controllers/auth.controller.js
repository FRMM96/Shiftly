const prisma = require('../db/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function signToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

exports.register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body

    if (!email || !username || !password || !role) {
      return res.status(400).json({ message: 'email, username, password, role are required' })
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true }
    })
    if (existing) return res.status(409).json({ message: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashed,  // ✅ correct field
        role
      },
      select: { id: true, email: true, username: true, role: true }
    })

    const token = signToken(user)
    return res.status(201).json({ token, user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'emailOrUsername and password are required' })
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] }
    })

    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    if (!user.passwordHash) {
      return res.status(400).json({ message: 'This account has no passwordHash stored. Delete it and re-register.' })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const safeUser = { id: user.id, email: user.email, username: user.username, role: user.role }
    const token = signToken(safeUser)
    return res.json({ token, user: safeUser })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.me = async (req, res) => {
  return res.json({ user: req.user })
}