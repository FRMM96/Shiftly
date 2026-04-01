const prisma = require('../db/prisma')

exports.listNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user.id, companyId: req.user.companyId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.notification.count({
        where: { userId: req.user.id, companyId: req.user.companyId }
      })
    ])

    const unread = await prisma.notification.count({
      where: { userId: req.user.id, companyId: req.user.companyId, read: false }
    })

    return res.json({ notifications, total, unread })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, companyId: req.user.companyId, read: false },
      data: { read: true }
    })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const notification = await prisma.notification.findUnique({ where: { id } })

    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    await prisma.notification.update({ where: { id }, data: { read: true } })
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
