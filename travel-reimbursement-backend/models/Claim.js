const mongoose = require("mongoose");

//  Expense Schema
const expenseSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  description: String,
  receiptPath: String,
});

// Reimbursement Info Schema
const reimbursementInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["UPI", "Bank Transfer", "Cash"],
    required: true,
  },
  transactionId: String,
  remarks: String,

  // UPI-specific
  upiId: String,

  // Bank-specific
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
  },
});

//  Claim Schema
const claimSchema = new mongoose.Schema(
  {
    //  Employee & trip info
    employeeName: String,
    employeeId: String,
    department: String,
    company: String,
    travelFrom: String,
    travelTo: String,
    purpose: String,
    travelDate: Date,
    returnDate: Date,

    //  Expenses list
    expenses: [expenseSchema],

    // Approval & Reimbursement Status
    status: {
      type: String,
      enum: [
        "Pending",
        "Forwarded to Director",
        "Approved",
        "Reimbursement Requested",
        "Claimed",
        "Paid",
        "Rejected",
      ],
      default: "Pending",
    },

    // Claim/Reimbursement tracking
    reimbursementRequested: { type: Boolean, default: false },
    reimbursementRequestedAt: { type: Date },

    paidAt: { type: Date, default: null },

    //  Online/Offline Mode
    paymentMode: {
      type: String,
      enum: ["Offline", "Online", null],
      default: null,
    },

    // Final reimbursement 
    reimbursementInfo: reimbursementInfoSchema,
  },
  { timestamps: true } //  createdAt, updatedAt
);

module.exports = mongoose.model("Claim", claimSchema);
