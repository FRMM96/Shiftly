const logger = require("../lib/logger")
const prisma = require('../db/prisma')
const bcrypt = require('bcryptjs')

exports.updateProfile = async (req, res) => {
  try {
    const { username, phone, department, location, emergencyContact, onboarded } = req.body

    const data = {}
    if (username !== undefined) data.username = username
    if (phone !== undefined) data.phone = phone
    if (department !== undefined) data.department = department
    if (location !== undefined) data.location = location
    if (emergencyContact !== undefined) data.emergencyContact = emergencyContact
    if (onboarded === true) data.onboarded = true

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'No fields to update' })
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true, email: true, username: true, role: true,
        phone: true, department: true, location: true,
        emergencyContact: true, companyId: true
      }
    })

    return res.json({ user })
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Username already taken' })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' })
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    const ok = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: hashed }
    })

    return res.json({ ok: true })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
