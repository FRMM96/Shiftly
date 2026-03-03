// Backend/src/routes/users.routes.js
const router = require('express').Router()
const { requireAuth } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')
const usersController = require('../controllers/users.controller')

router.get('/', requireAuth, requireRole('BOSS'), usersController.listUsers)

module.exports = router