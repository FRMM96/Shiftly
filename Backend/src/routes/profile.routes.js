const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const { updateProfileSchema, changePasswordSchema } = require('../schemas')
const { updateProfile, changePassword } = require('../controllers/profile.controller')

router.patch('/', requireAuth, validate(updateProfileSchema), updateProfile)
router.patch('/password', requireAuth, validate(changePasswordSchema), changePassword)

module.exports = router
