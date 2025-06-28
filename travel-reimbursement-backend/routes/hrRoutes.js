const express = require("express");
const router = express.Router();
const hrController = require("../controllers/hrController");

router.get("/pending", hrController.getPendingUsers);
router.patch("/approve/:id", hrController.approveUser);
router.patch("/reject/:id", hrController.rejectUser);

module.exports = router;
