const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')
const { validate } = require('../middleware/validate.middleware')
const { proposeSwapSchema, updateSwapSchema } = require('../schemas')
const { proposeSwap, listSwaps, updateSwap } = require('../controllers/swap.controller')

router.post('/', requireAuth, requireRole('EMPLOYEE'), validate(proposeSwapSchema), proposeSwap)
router.get('/', requireAuth, listSwaps)
router.patch('/:id', requireAuth, validate(updateSwapSchema), updateSwap)

module.exports = router
