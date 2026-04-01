// Backend/src/routes/marketplace.routes.js
const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");
const { assignApplicantSchema } = require("../schemas");

const marketplaceController = require("../controllers/marketplace.controller");

// List open shifts (any logged-in user)
router.get("/shifts", requireAuth, marketplaceController.listOpenShifts);

// Employee applies to a shift
router.post(
  "/shifts/:id/apply",
  requireAuth,
  requireRole("EMPLOYEE"),
  marketplaceController.applyToShift
);

// Manager views applicants for a shift
router.get(
  "/shifts/:id/applicants",
  requireAuth,
  requireRole("BOSS"),
  marketplaceController.listApplicants
);

// Manager assigns a shift to an applicant
router.post(
  "/shifts/:id/assign",
  requireAuth,
  requireRole("BOSS"),
  validate(assignApplicantSchema),
  marketplaceController.assignApplicant
);

// Manager rejects a single applicant
router.patch(
  "/shifts/:id/applications/:applicationId/reject",
  requireAuth,
  requireRole("BOSS"),
  marketplaceController.rejectApplicant
);

module.exports = router;