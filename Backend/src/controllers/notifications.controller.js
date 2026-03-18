const prisma = require('../db/prisma')

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return res.json({ notifications })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params

    const notification = await prisma.notification.findUnique({
      where: { id }
    })

    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })

    return res.json({ notification: updated })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false
      },
      data: { isRead: true }
    })

    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}