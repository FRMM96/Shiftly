const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')
const { validate } = require('../middleware/validate.middleware')
const { clockInOutSchema } = require('../schemas')
const { clockInOut, getTodayStatus, getShiftClockEvents } = require('../controllers/clock.controller')

router.post('/', requireAuth, requireRole('EMPLOYEE'), validate(clockInOutSchema), clockInOut)
router.get('/today', requireAuth, requireRole('EMPLOYEE'), getTodayStatus)
router.get('/shift/:shiftId', requireAuth, requireRole('BOSS'), getShiftClockEvents)

module.exports = router
