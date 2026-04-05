const logger = require("../lib/logger")
const multer = require("multer");
const prisma = require("../db/prisma");
const storage = require("../services/storageService");

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// Multer instance — stores file in memory so we pass buffer to storageService
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter(_req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error("File type not allowed"));
  },
});

/** POST /api/documents/upload — multipart upload (field name: "file") */
async function uploadDocument(req, res) {
  try {
    const { category } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file provided" });

    const key = storage.save(req.user.companyId, file.originalname, file.buffer);

    const doc = await prisma.document.create({
      data: {
        name: file.originalname,
        key,
        contentType: file.mimetype,
        size: file.size,
        category: category || "General",
        uploadedById: req.user.id,
        companyId: req.user.companyId,
      },
    });

    res.status(201).json(doc);
  } catch (err) {
    logger.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Upload failed" });
  }
}

/** GET /api/documents — list documents for the company */
async function listDocuments(req, res) {
  try {
    const { category } = req.query;
    const where = { companyId: req.user.companyId };
    if (category) where.category = category;

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { id: true, username: true } } },
    });

    res.json(documents);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/** GET /api/documents/:id/download — serve file */
async function downloadDocument(req, res) {
  try {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } });

    if (!doc || doc.companyId !== req.user.companyId) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = storage.getPath(doc.key);
    res.setHeader("Content-Type", doc.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${doc.name}"`);
    res.sendFile(filePath);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/** DELETE /api/documents/:id — manager only */
async function deleteDocument(req, res) {
  try {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } });

    if (!doc || doc.companyId !== req.user.companyId) {
      return res.status(404).json({ message: "Document not found" });
    }

    storage.remove(doc.key);
    await prisma.document.delete({ where: { id: doc.id } });

    res.json({ ok: true });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { upload, uploadDocument, listDocuments, downloadDocument, deleteDocument };
