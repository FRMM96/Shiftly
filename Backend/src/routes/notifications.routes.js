const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middleware/auth.middleware')
const notificationsController = require('../controllers/notifications.controller')

router.get('/me', requireAuth, notificationsController.getMyNotifications)
router.patch('/:id/read', requireAuth, notificationsController.markAsRead)
router.patch('/read-all', requireAuth, notificationsController.markAllAsRead)

module.exports = router