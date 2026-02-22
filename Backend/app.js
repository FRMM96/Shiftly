require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const usersRoutes = require("./src/routes/users.routes");
const shiftsRoutes = require("./src/routes/shifts.routes");
const marketplaceRoutes = require("./src/routes/marketplace.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Shiftly backend running ✅"));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/shifts", shiftsRoutes);
app.use("/api/marketplace", marketplaceRoutes);

// Helpful: basic 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
