const prisma = require('../db/prisma')
const { getIO } = require('../socket')

/**
 * Create a notification for a user and push it via WebSocket.
 */
async function createNotification(userId, companyId, type, message, actionUrl = null) {
  const notification = await prisma.notification.create({
    data: { userId, companyId, type, message, actionUrl }
  })

  // Push to the user's socket room in real time
  const io = getIO()
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notification)
  }

  return notification
}

/**
 * Notify all managers in a company.
 */
async function notifyManagers(companyId, type, message, actionUrl = null) {
  const managers = await prisma.user.findMany({
    where: { companyId, role: 'BOSS' },
    select: { id: true }
  })
  return Promise.all(
    managers.map(m => createNotification(m.id, companyId, type, message, actionUrl))
  )
}

/**
 * Notify all workers (employees) in a company.
 */
async function notifyWorkers(companyId, type, message, actionUrl = null) {
  const workers = await prisma.user.findMany({
    where: { companyId, role: 'EMPLOYEE' },
    select: { id: true }
  })
  return Promise.all(
    workers.map(w => createNotification(w.id, companyId, type, message, actionUrl))
  )
}

module.exports = { createNotification, notifyManagers, notifyWorkers }
