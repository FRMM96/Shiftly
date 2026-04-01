const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");
const { createShiftSchema, updateShiftSchema } = require("../schemas");

const {
  createShift,
  listManagerShifts,
  listMyShifts,
  listUserShifts,
  getShift,
  updateShift,
  deleteShift,
} = require("../controllers/shift.controller");

// Worker (must be before "/:id")
router.get("/me", requireAuth, requireRole("EMPLOYEE"), listMyShifts);
router.get("/user/:userId", requireAuth, listUserShifts);

// Manager
router.post("/", requireAuth, requireRole("BOSS"), validate(createShiftSchema), createShift);
router.get("/", requireAuth, requireRole("BOSS"), listManagerShifts);
router.patch("/:id", requireAuth, requireRole("BOSS"), validate(updateShiftSchema), updateShift);
router.delete("/:id", requireAuth, requireRole("BOSS"), deleteShift);

// Shared view (manager can view own; worker can view assigned)
router.get("/:id", requireAuth, getShift);

module.exports = router;