import { io } from 'socket.io-client'
import { useNotificationStore } from '../stores/notificationStore'

let socket = null

/**
 * Connect to the WebSocket server using the current auth token.
 * Should be called after login / on app mount when a token exists.
 */
export function connectSocket() {
  const token = localStorage.getItem('auth_token')
  if (!token || socket?.connected) return

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
  // Socket.IO connects to the server root, not the /api path
  const serverURL = baseURL.replace(/\/api\/?$/, '')

  socket = io(serverURL, {
    auth: { token },
    transports: ['websocket', 'polling']
  })

  socket.on('connect', () => {
    console.debug('[socket] connected', socket.id)
  })

  // Real-time notification push — update Pinia store immediately
  socket.on('notification:new', (notification) => {
    const store = useNotificationStore()
    store.notifications.unshift(notification)
    store.unreadCount++
  })

  socket.on('disconnect', (reason) => {
    console.debug('[socket] disconnected:', reason)
  })
}

/**
 * Disconnect the socket (call on logout).
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function getSocket() {
  return socket
}
