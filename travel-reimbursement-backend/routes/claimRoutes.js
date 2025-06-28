const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");


// 1. Submit new claim
router.post("/claim", upload.array("receipts"), claimController.createClaim);

// 2. Get logged-in employee's claims
router.get("/employee/claims", protect, claimController.getEmployeeClaims);

// 3. Request reimbursement (after Director approval)
router.patch( "/claims/:id/request-reimbursement",
protect,claimController.requestReimbursement
);

// 4. Update claim status (HR/Director)
router.put("/claims/:id/status", claimController.updateClaimStatus);

// 5. Get all claims
router.get("/claims", claimController.getAllClaims);

// 6. Mark claim as paid (Office Dashboard)
router.patch("/claims/:id/mark-paid", claimController.markClaimAsPaid);

module.exports = router;
