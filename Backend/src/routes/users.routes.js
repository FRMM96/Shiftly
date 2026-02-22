const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const { listUsers } = require("../controllers/users.controller");

router.get("/", auth, requireRole("BOSS"), listUsers);

module.exports = router;
