const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");
const { assignApplicantSchema } = require("../schemas");

const marketplaceController = require("../controllers/marketplace.controller");

router.get("/applications/me", requireAuth, requireRole("EMPLOYEE"), marketplaceController.listMyApplications);

router.get("/shifts", requireAuth, marketplaceController.listOpenShifts);
router.post("/shifts/:id/apply", requireAuth, requireRole("EMPLOYEE"), marketplaceController.applyToShift);
router.get("/shifts/:id/applicants", requireAuth, requireRole("BOSS"), marketplaceController.listApplicants);
router.post("/shifts/:id/assign", requireAuth, requireRole("BOSS"), marketplaceController.assignApplicant);

// Manager rejects a single applicant
router.patch(
  "/shifts/:id/applications/:applicationId/reject",
  requireAuth,
  requireRole("BOSS"),
  marketplaceController.rejectApplicant
);

module.exports = router;