const logger = require("../lib/logger")
const prisma = require('../db/prisma')
const { createNotification, notifyManagers } = require('../helpers/notification')

function parseDateOnlyToUTC(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0))
}

exports.createTimeOff = async (req, res) => {
  try {
    const { startDate, endDate, type, notes } = req.body

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' })
    }

    const start = parseDateOnlyToUTC(startDate)
    const end = parseDateOnlyToUTC(endDate)
    if (!start || !end) return res.status(400).json({ message: 'Invalid date format (YYYY-MM-DD)' })
    if (end < start) return res.status(400).json({ message: 'endDate must be after startDate' })

    const validTypes = ['ANNUAL', 'SICK', 'PERSONAL']
    const finalType = validTypes.includes(type) ? type : 'ANNUAL'

    const request = await prisma.timeOffRequest.create({
      data: {
        startDate: start,
        endDate: end,
        type: finalType,
        notes: notes || null,
        userId: req.user.id,
        companyId: req.user.companyId
      }
    })

    await notifyManagers(
      req.user.companyId,
      'TIME_OFF_REQUEST',
      `${req.user.username} requested ${finalType.toLowerCase()} leave from ${startDate} to ${endDate}`,
      '/manager/timeoff'
    )

    return res.status(201).json({ request })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.listTimeOff = async (req, res) => {
  try {
    const where = { companyId: req.user.companyId }

    // Employees see only their own; managers see all in company
    if (req.user.role === 'EMPLOYEE') {
      where.userId = req.user.id
    }

    const requests = await prisma.timeOffRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, username: true } }
      }
    })

    return res.json({ requests })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.updateTimeOff = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['APPROVED', 'DENIED'].includes(status)) {
      return res.status(400).json({ message: 'status must be APPROVED or DENIED' })
    }

    const existing = await prisma.timeOffRequest.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ message: 'Request not found' })
    if (existing.companyId !== req.user.companyId) return res.status(403).json({ message: 'Forbidden' })
    if (existing.status !== 'PENDING') return res.status(400).json({ message: 'Request already processed' })

    const request = await prisma.timeOffRequest.update({
      where: { id },
      data: { status }
    })

    await createNotification(
      existing.userId,
      existing.companyId,
      'TIME_OFF_RESPONSE',
      `Your time-off request has been ${status.toLowerCase()}`,
      '/worker/calendar'
    )

    return res.json({ request })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
