
const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const { requireAuth } = require('../middleware/auth.middleware')

// Public
router.post('/register', authController.register)
router.post('/login', authController.login)

// Protected
router.get('/me', requireAuth, authController.me)

module.exports = router