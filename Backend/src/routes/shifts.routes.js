const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const {
  createShift,
  listManagerShifts,
  listMyShifts,
  getShift,
  updateShift,
  deleteShift,
} = require("../controllers/shifts.controller");

// Boss (manager) endpoints
router.post("/", auth, requireRole("BOSS"), createShift);
router.get("/", auth, requireRole("BOSS"), listManagerShifts);
router.patch("/:id", auth, requireRole("BOSS"), updateShift);
router.delete("/:id", auth, requireRole("BOSS"), deleteShift);

// Employee endpoints
router.get("/me", auth, requireRole("EMPLOYEE"), listMyShifts);

// Shared
router.get("/:id", auth, getShift);

module.exports = router;
