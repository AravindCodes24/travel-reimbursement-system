const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/hash");
const { createJwtToken } = require("../utils/jwt");

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role, employeeId } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !role ||
      (role === "employee" && !employeeId)
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({
      email,
      status: { $ne: "rejected" },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (role === "employee") {
      const existingEmp = await User.findOne({
        employeeId,
        status: { $ne: "rejected" },
      });
      if (existingEmp) {
        return res.status(400).json({ message: "Employee ID already in use" });
      }
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      username,
      email,
      passwordHash,
      role,
      employeeId: role === "employee" ? employeeId : undefined,
      status: "pending",
    });

    return res.status(201).json({
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role,
        token: createJwtToken(user),
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (error.keyPattern?.employeeId) {
        return res.status(400).json({ message: "Employee ID already in use" });
      }
    }
    return res
      .status(500)
      .json({ message: error.message || "Registration failed" });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login attempt:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      $or: [{ email }, { employeeId: email }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Your account is not yet approved." });
    }

    const token = createJwtToken(user);
    console.log("Login successful:", email);
    console.log("Generated JWT Token:", token);

    res.status(200).json({
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("❗Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Optional: Get all users (for debug)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
