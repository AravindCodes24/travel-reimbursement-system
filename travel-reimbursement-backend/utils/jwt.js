const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function createJwtToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
}

module.exports = { createJwtToken };
