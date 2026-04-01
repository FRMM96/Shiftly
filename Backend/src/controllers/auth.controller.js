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

async function buildSafeUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      companyId: true,
      createdAt: true,
      company: {
        select: {
          id: true,
          name: true,
          inviteCode: true,
          createdAt: true,
          _count: {
            select: {
              users: true,
              shifts: true,
            },
          },
        },
      },
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    companyId: user.companyId,
    createdAt: user.createdAt,
    company: user.company
      ? {
          id: user.company.id,
          name: user.company.name,
          inviteCode: user.company.inviteCode,
          createdAt: user.company.createdAt,
          totalUsers: user.company._count.users,
          totalShifts: user.company._count.shifts,
        }
      : null,
  }
}

exports.register = async (req, res) => {
  try {
    const { email, username, password, role, inviteCode, companyName } = req.body

    if (!email || !username || !password || !role) {
      return res.status(400).json({ message: 'email, username, password, role are required' })
    }

    let company = null
    const trimmedCompanyName = String(companyName || '').trim()
    const trimmedInviteCode = String(inviteCode || '').trim()

    if (role === 'BOSS') {
      if (trimmedCompanyName) {
        const existingCompany = await prisma.company.findUnique({ where: { name: trimmedCompanyName } })
        if (existingCompany) {
          return res.status(409).json({ message: 'A company with that name already exists' })
        }

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
        if (!trimmedInviteCode) {
          return res.status(400).json({ message: 'Managers must provide companyName OR inviteCode' })
        }
        company = await prisma.company.findUnique({ where: { inviteCode: trimmedInviteCode } })
        if (!company) return res.status(400).json({ message: 'Invalid invite code' })
      }

      const bossCount = await prisma.user.count({
        where: { companyId: company.id, role: 'BOSS' }
      })
      if (bossCount >= MAX_BOSSES_PER_COMPANY) {
        return res.status(400).json({ message: 'Manager limit reached for this company' })
      }
    } else {
      if (!trimmedInviteCode) return res.status(400).json({ message: 'Employees must provide an inviteCode' })
      company = await prisma.company.findUnique({ where: { inviteCode: trimmedInviteCode } })
      if (!company) return res.status(400).json({ message: 'Invalid invite code' })
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true }
    })
    if (existing) return res.status(409).json({ message: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)

    const created = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashed,
        role,
        companyId: company.id
      },
      select: { id: true }
    })

    const user = await buildSafeUser(created.id)
    const token = signToken(user)

    const payload = { token, user }
    if (role === 'BOSS' && trimmedCompanyName) {
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

    const safeUser = await buildSafeUser(user.id)
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
