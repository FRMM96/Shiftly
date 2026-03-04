const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const {
  createShift,
  listManagerShifts,
  listMyShifts,
  getShift,
  updateShift,
  deleteShift,
} = require("../controllers/shift.controller");

// Worker (must be before "/:id")
router.get("/me", requireAuth, requireRole("EMPLOYEE"), listMyShifts);

// Manager
router.post("/", requireAuth, requireRole("BOSS"), createShift);
router.get("/", requireAuth, requireRole("BOSS"), listManagerShifts);
router.patch("/:id", requireAuth, requireRole("BOSS"), updateShift);
router.delete("/:id", requireAuth, requireRole("BOSS"), deleteShift);

// Shared view (manager can view own; worker can view assigned)
router.get("/:id", requireAuth, getShift);

module.exports = router;