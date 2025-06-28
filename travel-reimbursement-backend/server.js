const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

require("dotenv").config();

// Api routes
const authRoutes = require("./routes/authRoutes");
const claimRoutes = require("./routes/claimRoutes");
const hrRoutes = require("./routes/hrRoutes");
const payoutRoutes = require("./routes/payoutRoutes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/uploads", express.static("uploads"));

//   API route setup
app.use("/api", authRoutes); // Auth routes (register, login)

// Claim-related (submission, employee view
app.use("/api", claimRoutes); //api/submit-claim
app.use("/api/claims", claimRoutes); //api/claims/employee/:id

// HR user management
app.use("/api/users", hrRoutes); // HR user approval

//  payout processing
app.use("/api/payouts", payoutRoutes);


// Root route for sanity check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;
