const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const logger = require('./lib/logger')

let io = null

/**
 * Attach Socket.IO to an existing HTTP server.
 * Authenticates connections via JWT passed as `auth.token`.
 */
function initSocket(httpServer) {
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4173')
    .split(',')
    .map(o => o.trim())

  io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true }
  })

  // Authenticate on connection using the same JWT_SECRET as the REST API
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Authentication required'))

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.userId
      socket.companyId = decoded.companyId
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    // Join a room scoped to the user so we can target individual pushes
    socket.join(`user:${socket.userId}`)
    // Join a company-wide room for broadcast events
    socket.join(`company:${socket.companyId}`)

    logger.info({ userId: socket.userId }, 'socket connected')

    socket.on('disconnect', () => {
      logger.info({ userId: socket.userId }, 'socket disconnected')
    })
  })

  return io
}

/** Get the live io instance (null until initSocket is called). */
function getIO() {
  return io
}

module.exports = { initSocket, getIO }
