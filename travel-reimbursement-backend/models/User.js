const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true, // useful for skipping uniqueness checks when field is null
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true, // allows office or director accounts without employee ID
  },
  passwordHash: { type: String, required: true },

  //Roles for routing logic
  role: {
    type: String,
    enum: ["employee", "hr", "director", "office"],
    required: true,
  },

  //  Approval status for onboarding
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

  

module.exports = mongoose.model("User", userSchema);
