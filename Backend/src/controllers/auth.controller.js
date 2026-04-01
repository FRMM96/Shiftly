const prisma = require('../db/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const MAX_BOSSES_PER_COMPANY = 3

function signToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function makeInviteCode(len = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

async function createUniqueInviteCode() {
  for (let i = 0; i < 10; i++) {
    const code = makeInviteCode(10)
    const exists = await prisma.company.findUnique({ where: { inviteCode: code } })
    if (!exists) return code
  }
  throw new Error('Failed to generate invite code')
}

exports.register = async (req, res) => {
  try {
    const { email, username, password, role, inviteCode, companyName } = req.body

    if (!email || !username || !password || !role) {
      return res.status(400).json({ message: 'email, username, password, role are required' })
    }

    // company logic
    let company = null

    if (role === 'BOSS') {
      if (companyName && String(companyName).trim()) {
        // Boss creates a new company
        const code = await createUniqueInviteCode()
        try {
          company = await prisma.company.create({
            data: { name: String(companyName).trim(), inviteCode: code }
          })
        } catch (dbErr) {
          if (dbErr.code === 'P2002') {
            return res.status(409).json({ message: 'Company name already in use' })
          }
          throw dbErr
        }
      } else {
        // Boss joins existing company via inviteCode
        if (!inviteCode) {
          return res.status(400).json({ message: 'Managers must provide companyName OR inviteCode' })
        }
        company = await prisma.company.findUnique({ where: { inviteCode: String(inviteCode).trim() } })
        if (!company) return res.status(400).json({ message: 'Invalid invite code' })
      }

      // manager limit
      const bossCount = await prisma.user.count({
        where: { companyId: company.id, role: 'BOSS' }
      })
      if (bossCount >= MAX_BOSSES_PER_COMPANY) {
        return res.status(400).json({ message: 'Manager limit reached for this company' })
      }
    } else {
      // EMPLOYEE must join via inviteCode
      if (!inviteCode) return res.status(400).json({ message: 'Employees must provide an inviteCode' })
      company = await prisma.company.findUnique({ where: { inviteCode: String(inviteCode).trim() } })
      if (!company) return res.status(400).json({ message: 'Invalid invite code' })
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
        passwordHash: hashed,
        role,
        companyId: company.id
      },
      select: { id: true, email: true, username: true, role: true, companyId: true }
    })

    const token = signToken(user)

    // If boss created a company, return inviteCode so they can share it
    const payload = {
      token,
      user,
      company: { id: company.id, name: company.name }
    }
    if (role === 'BOSS' && companyName && String(companyName).trim()) {
      payload.companyInviteCode = company.inviteCode
    }

    return res.status(201).json(payload)
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
    if (!user.passwordHash) return res.status(400).json({ message: 'Account has no passwordHash stored' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      companyId: user.companyId
    }
    const token = signToken(safeUser)

    return res.json({ token, user: safeUser })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.me = async (req, res) => {
  if (req.user.companyId) {
    const company = await prisma.company.findUnique({
      where: { id: req.user.companyId },
      select: { id: true, name: true, inviteCode: true }
    })
    return res.json({ user: { ...req.user, company } })
  }
  return res.json({ user: req.user })
}