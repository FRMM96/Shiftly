const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')
const { validate } = require('../middleware/validate.middleware')
const { reportSickSchema } = require('../schemas')
const { reportSick, listSickLeaves, acknowledgeSick } = require('../controllers/sick.controller')

router.post('/', requireAuth, requireRole('EMPLOYEE'), validate(reportSickSchema), reportSick)
router.get('/', requireAuth, listSickLeaves)
router.patch('/:id', requireAuth, requireRole('BOSS'), acknowledgeSick)

module.exports = router
