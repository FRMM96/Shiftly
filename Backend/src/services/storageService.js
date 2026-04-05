const fs = require("fs");
const path = require("path");

const UPLOADS_ROOT = path.join(__dirname, "../../uploads");

/**
 * Local-first storage service.
 * Swap to S3 by setting STORAGE_PROVIDER=s3 and providing S3_BUCKET / S3_REGION / S3_ENDPOINT env vars.
 */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Save a file buffer to local disk. Returns the storage key. */
function save(companyId, filename, buffer) {
  const dir = path.join(UPLOADS_ROOT, companyId);
  ensureDir(dir);
  const key = `${companyId}/${Date.now()}-${filename}`;
  fs.writeFileSync(path.join(UPLOADS_ROOT, key), buffer);
  return key;
}

/** Get the absolute filesystem path for a stored file. */
function getPath(key) {
  return path.join(UPLOADS_ROOT, key);
}

/** Remove a file from local disk. */
function remove(key) {
  const full = path.join(UPLOADS_ROOT, key);
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

module.exports = { save, getPath, remove };
