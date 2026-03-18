const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const usersController = require("../controllers/users.controller");

router.get("/", requireAuth, requireRole("BOSS"), usersController.listUsers);
router.get("/:id", requireAuth, requireRole("BOSS"), usersController.getUserDetails);

module.exports = router;