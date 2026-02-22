const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const {
  listOpenShifts,
  applyToShift,
  listApplicants,
  assignApplicant,
} = require("../controllers/marketplace.controller");

router.get("/shifts", auth, listOpenShifts);
router.post("/shifts/:id/apply", auth, requireRole("EMPLOYEE"), applyToShift);

// Boss-only
router.get("/shifts/:id/applicants", auth, requireRole("BOSS"), listApplicants);
router.post("/shifts/:id/assign", auth, requireRole("BOSS"), assignApplicant);

module.exports = router;
