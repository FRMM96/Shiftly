// Backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken')
const prisma = require('../db/prisma')

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [type, token] = header.split(' ')

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, username: true, role: true, companyId: true, phone: true, department: true, location: true, emergencyContact: true, onboarded: true }
    })

    if (!user) return res.status(401).json({ message: 'Not authenticated' })

    req.user = user
    next()
  } catch (e) {
    console.error('[requireAuth Error]', e)
    return res.status(401).json({ message: 'Not authenticated' })
  }
}

module.exports = { requireAuth }