const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')
const { validate } = require('../middleware/validate.middleware')
const { createTimeOffSchema, updateTimeOffSchema } = require('../schemas')
const { createTimeOff, listTimeOff, updateTimeOff } = require('../controllers/timeoff.controller')

router.post('/', requireAuth, requireRole('EMPLOYEE'), validate(createTimeOffSchema), createTimeOff)
router.get('/', requireAuth, listTimeOff)
router.patch('/:id', requireAuth, requireRole('BOSS'), validate(updateTimeOffSchema), updateTimeOff)

module.exports = router
