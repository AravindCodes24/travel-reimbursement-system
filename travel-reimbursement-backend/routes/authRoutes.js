const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

//  For development only
router.get("/login", getAllUsers);

module.exports = router;
