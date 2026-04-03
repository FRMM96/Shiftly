const { Router } = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const {
  summary,
  shiftsByStatus,
  hoursByWeek,
  attendanceRate,
  workerSummary,
} = require("../controllers/analytics.controller");

const router = Router();

// Manager-only
router.get("/summary", requireAuth, requireRole("BOSS"), summary);
router.get("/attendance-rate", requireAuth, requireRole("BOSS"), attendanceRate);

// Shared (role-aware inside controller)
router.get("/shifts-by-status", requireAuth, shiftsByStatus);
router.get("/hours-by-week", requireAuth, hoursByWeek);

// Worker-only
router.get("/worker-summary", requireAuth, requireRole("EMPLOYEE"), workerSummary);

module.exports = router;
