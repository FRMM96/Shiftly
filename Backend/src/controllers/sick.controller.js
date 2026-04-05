const logger = require("../lib/logger")
const prisma = require('../db/prisma')
const { createNotification, notifyManagers } = require('../helpers/notification')

function parseDateOnlyToUTC(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0))
}

exports.reportSick = async (req, res) => {
  try {
    const { date, shiftId, reason } = req.body

    if (!date) {
      return res.status(400).json({ message: 'date is required' })
    }

    const dt = parseDateOnlyToUTC(date)
    if (!dt) return res.status(400).json({ message: 'Invalid date format (YYYY-MM-DD)' })

    const sickLeave = await prisma.sickLeave.create({
      data: {
        date: dt,
        reason: reason || null,
        shiftId: shiftId || null,
        userId: req.user.id,
        companyId: req.user.companyId
      }
    })

    await notifyManagers(
      req.user.companyId,
      'SICK_LEAVE',
      `${req.user.username} reported sick for ${date}`,
      '/manager/sick'
    )

    return res.status(201).json({ sickLeave })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.listSickLeaves = async (req, res) => {
  try {
    const where = { companyId: req.user.companyId }

    if (req.user.role === 'EMPLOYEE') {
      where.userId = req.user.id
    }

    const sickLeaves = await prisma.sickLeave.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, username: true } }
      }
    })

    return res.json({ sickLeaves })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.acknowledgeSick = async (req, res) => {
  try {
    const { id } = req.params

    const existing = await prisma.sickLeave.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ message: 'Sick leave not found' })
    if (existing.companyId !== req.user.companyId) return res.status(403).json({ message: 'Forbidden' })

    const sickLeave = await prisma.sickLeave.update({
      where: { id },
      data: { acknowledged: true }
    })

    await createNotification(
      existing.userId,
      existing.companyId,
      'SICK_ACKNOWLEDGED',
      'Your sick leave report has been acknowledged by management',
      '/worker/calendar'
    )

    return res.json({ sickLeave })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
