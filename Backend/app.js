require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./src/routes/auth.routes");
const usersRoutes = require("./src/routes/users.routes");
const shiftsRoutes = require("./src/routes/shifts.routes");
const marketplaceRoutes = require("./src/routes/marketplace.routes");
const profileRoutes = require("./src/routes/profile.routes");
const notificationRoutes = require("./src/routes/notification.routes");
const timeoffRoutes = require("./src/routes/timeoff.routes");
const sickRoutes = require("./src/routes/sick.routes");
const clockRoutes = require("./src/routes/clock.routes");
const swapRoutes = require("./src/routes/swap.routes");

const app = express();

// Security headers
app.use(helmet());

// CORS — allow known frontend origins only
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:4173")
  .split(",")
  .map(o => o.trim());

app.use(cors({
  origin(origin, cb) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

// Rate limiting on auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" }
});
app.use("/api/auth", authLimiter);

app.get("/", (req, res) => res.send("Shiftly backend running ✅"));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/shifts", shiftsRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/timeoff", timeoffRoutes);
app.use("/api/sick", sickRoutes);
app.use("/api/clock", clockRoutes);
app.use("/api/swaps", swapRoutes);

// Helpful: basic 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
