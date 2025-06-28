const mongoose = require("mongoose");
const User = require("../models/User");

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "pending" });
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

exports.approveUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User approved", user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to approve user", error: err.message });
  }
};

exports.rejectUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User rejected", user: deletedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to reject user", error: err.message });
  }
};
