const prisma = require('../db/prisma')
const { notifyManagers } = require('../helpers/notification')

exports.clockInOut = async (req, res) => {
  try {
    const { shiftId, type, location } = req.body

    if (!shiftId || !type) {
      return res.status(400).json({ message: 'shiftId and type (CLOCK_IN or CLOCK_OUT) are required' })
    }

    if (!['CLOCK_IN', 'CLOCK_OUT'].includes(type)) {
      return res.status(400).json({ message: 'type must be CLOCK_IN or CLOCK_OUT' })
    }

    // Verify shift belongs to this worker
    const shift = await prisma.shift.findUnique({ where: { id: shiftId } })
    if (!shift || shift.workerId !== req.user.id) {
      return res.status(403).json({ message: 'Not assigned to this shift' })
    }
    if (shift.companyId !== req.user.companyId) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const clockEvent = await prisma.clockEvent.create({
      data: {
        type,
        location: location || null,
        userId: req.user.id,
        shiftId,
        companyId: req.user.companyId
      }
    })

    const action = type === 'CLOCK_IN' ? 'clocked in' : 'clocked out'
    await notifyManagers(
      req.user.companyId,
      type,
      `${req.user.username} ${action} for shift ${shift.roleName}`,
      '/manager'
    )

    return res.status(201).json({ clockEvent })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.getTodayStatus = async (req, res) => {
  try {
    const today = new Date()
    const startOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
    const endOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1))

    const events = await prisma.clockEvent.findMany({
      where: {
        userId: req.user.id,
        companyId: req.user.companyId,
        timestamp: { gte: startOfDay, lt: endOfDay }
      },
      orderBy: { timestamp: 'desc' }
    })

    return res.json({ events })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.getShiftClockEvents = async (req, res) => {
  try {
    const { shiftId } = req.params

    const shift = await prisma.shift.findUnique({ where: { id: shiftId } })
    if (!shift) return res.status(404).json({ message: 'Shift not found' })
    if (shift.companyId !== req.user.companyId) return res.status(403).json({ message: 'Forbidden' })

    const events = await prisma.clockEvent.findMany({
      where: { shiftId, companyId: req.user.companyId },
      orderBy: { timestamp: 'asc' },
      include: {
        user: { select: { id: true, email: true, username: true } }
      }
    })

    return res.json({ events })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
