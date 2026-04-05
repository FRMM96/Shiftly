const { Router } = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const {
  upload,
  uploadDocument,
  listDocuments,
  downloadDocument,
  deleteDocument,
} = require("../controllers/document.controller");

const router = Router();

// Upload — managers only
router.post("/upload", requireAuth, requireRole("BOSS"), upload.single("file"), uploadDocument);

// List — any authenticated user in the company
router.get("/", requireAuth, listDocuments);

// Download — any authenticated user in the company
router.get("/:id/download", requireAuth, downloadDocument);

// Delete — managers only
router.delete("/:id", requireAuth, requireRole("BOSS"), deleteDocument);

module.exports = router;
