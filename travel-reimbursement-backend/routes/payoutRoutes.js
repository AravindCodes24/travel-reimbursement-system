const express = require("express");
const router = express.Router();
const { processPayout } = require("../controllers/payoutController");

router.post('/process', processPayout);

module.exports = router;
