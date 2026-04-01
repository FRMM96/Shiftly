const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth.middleware')
const { listNotifications, markAllAsRead, markAsRead } = require('../controllers/notification.controller')

router.get('/', requireAuth, listNotifications)
router.patch('/read-all', requireAuth, markAllAsRead)
router.patch('/:id/read', requireAuth, markAsRead)

module.exports = router
