const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const { requireAuth } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const { registerSchema, loginSchema } = require('../schemas')

// Public
router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)

// Protected
router.get('/me', requireAuth, authController.me)

module.exports = router