const Claim = require("../models/Claim");
// CREATE CLAIM
const createClaim = async (req, res) => {
  try {
    const employeeInfo = JSON.parse(req.body.employeeInfo);
    const travelDetails = JSON.parse(req.body.travelDetails);
    const expenses = JSON.parse(req.body.expenses);
    const files = req.files;

    const expensesWithReceipts = expenses.map((exp, idx) => ({
      ...exp,
      receiptPath: files[idx] ? files[idx].path : null,
    }));

    const claim = new Claim({
      employeeName: employeeInfo.name,
      employeeId: employeeInfo.employeeId,
      department: employeeInfo.department,
      company: employeeInfo.company,
      employeeInfo,
      travelFrom: travelDetails.from,
      travelTo: travelDetails.to,
      purpose: travelDetails.purpose,
      travelDate: travelDetails.startDate,
      returnDate: travelDetails.endDate,
      expenses: expensesWithReceipts,
      status: "Pending",
      createdAt: new Date(),
    });

    const savedClaim = await claim.save();
    res
      .status(201)
      .json({ message: "Claim saved successfully", claim: savedClaim });
  } catch (error) {
    console.error("❌ Error saving claim:", error);
    res
      .status(500)
      .json({ message: "Failed to save claim", error: error.message });
  }
};
// GET EMPLOYEE
const getEmployeeClaims = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const claims = await Claim.find({ employeeId });

    if (!claims.length) {
      return res
        .status(404)
        .json({ message: "No claims found for your Employee ID." });
    }

    res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching employee claims:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
const requestReimbursement = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ error: "Claim not found" });

    if (claim.status !== "Approved") {
      return res.status(400).json({ error: "Claim not approved by Director" });
    }
    const {
      method,
      upiId,
      accountHolderName,
      accountNumber,
      ifscCode,
      remarks,
    } = req.body;
    if (!method || !["UPI", "Bank Transfer", "Cash"].includes(method)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing payment method" });
    }
    const reimbursementInfo = {
      method,
      remarks: remarks || "",
    };
    if (method === "UPI") {
      if (!upiId) return res.status(400).json({ error: "UPI ID is required" });
      reimbursementInfo.upiId = upiId;
    }
    if (method === "Bank Transfer") {
      if (!accountHolderName || !accountNumber || !ifscCode) {
        return res.status(400).json({ error: "Bank details are incomplete" });
      }
      reimbursementInfo.bankDetails = {
        accountHolderName,
        accountNumber,
        ifscCode,
      };
    }
    // Update claim
    claim.reimbursementInfo = reimbursementInfo;
    claim.reimbursementRequested = true;
    claim.reimbursementRequestedAt = new Date();
    claim.status = "Reimbursement Requested";

    await claim.save();

    res.status(200).json({
      message: "Reimbursement requested successfully",
      updatedClaim: claim,
    });
  } catch (error) {
    console.error("❌ Request reimbursement error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//HR / DIRECTOR
const updateClaimStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedClaim = await Claim.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedClaim) {
      return res.status(404).json({ error: "Claim not found." });
    }
    res.status(200).json({
      message: "Claim status updated successfully",
      updatedClaim,
    });
  } catch (err) {
    console.error("❌ Error updating claim status:", err);
    res.status(500).json({ error: "Failed to update claim status." });
  }
};
// OFFICE MANAGEMENT
const markAsReimbursed = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (claim.status !== "Reimbursement Requested") {
      return res
        .status(400)
        .json({ message: "Claim has not been requested for reimbursement" });
    }
    claim.status = "Reimbursed";
    claim.reimbursedAt = new Date();

    await claim.save();
    res.status(200).json({ message: "Claim marked as reimbursed", claim });
  } catch (err) {
    console.error("Error marking reimbursed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//  COMMON FOR ALL
const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find();
    res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching all claims:", error);
    res.status(500).json({ error: "Failed to fetch claims." });
  }
};
const markClaimAsPaid = async (req, res) => {
  try {
    const { paymentMethod, transactionId, remarks } = req.body;
    const claimId = req.params.id;

    // Validate required fields
    if (!paymentMethod || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Payment method and transaction ID are required",
      });
    }
    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // Validate claim status
    if (claim.status !== "Reimbursement Requested") {
      return res.status(400).json({
        success: false,
        message: 'Claim must be in "Reimbursement Requested" status',
      });
    }

    // Prepare update object
    const updateData = {
      status: "Paid",
      paidAt: new Date(),
      paymentMode: paymentMethod === "Cash" ? "Offline" : "Online",
      reimbursementInfo: {
        method: paymentMethod,
        transactionId,
        remarks: remarks || "",
        ...(paymentMethod === "UPI" && { upiId: req.body.upiId }),
        ...(paymentMethod === "Bank Transfer" && {
          bankDetails: {
            accountHolderName: req.body.accountHolderName,
            accountNumber: req.body.accountNumber,
            ifscCode: req.body.ifscCode,
          },
        }),
      },
    };

    const updatedClaim = await Claim.findByIdAndUpdate(claimId, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: updatedClaim,
    });
  } catch (error) {
    console.error("Payment processing error:", {
      message: error.message,
      stack: error.stack,
      errors: error.errors,
    });

    return res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
//  EXPORTS
module.exports = {
  createClaim,
  getEmployeeClaims,
  requestReimbursement,
  updateClaimStatus,
  markAsReimbursed,
  markClaimAsPaid,
  getAllClaims,
};
