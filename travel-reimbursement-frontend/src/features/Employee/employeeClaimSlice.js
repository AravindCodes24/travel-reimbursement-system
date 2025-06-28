import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  claims: [],
  loading: false,
  error: null,
  viewMode: "grid",
  paymentStatus: null,
  paymentMethod: "",
  upiId: "",
  bankDetails: {
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  },
  selectedClaim: null,
  selectedReceipt: null,
  receiptOpen: false,
  detailDialogOpen: false,
  paymentModalOpen: false,
  remarks: "",
  claimForm: {
    step: 0,
    employeeInfo: {
      name: "",
      employeeId: "",
      department: "",
      company: "",
    },
    travelDetails: {
      from: "",
      to: "",
      purpose: "",
      startDate: "",
      endDate: "",
    },
    expenses: [{ type: "", amount: "", description: "", receiptFile: null }],
    submitStatus: "idle",
    submitError: null,
  },
};

const employeeClaimSlice = createSlice({
  name: "employeeClaim",
  initialState,
  reducers: {
    fetchClaimsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchClaimsSuccess(state, action) {
      state.claims = action.payload;
      state.loading = false;
    },
    fetchClaimsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    setUpiId(state, action) {
      state.upiId = action.payload;
    },
    setBankDetails(state, action) {
      state.bankDetails = action.payload;
    },
    setPaymentStatus(state, action) {
      state.paymentStatus = action.payload;
    },
    setRemarks(state, action) {
      state.remarks = action.payload;
    },
    resetPaymentState(state) {
      state.paymentMethod = "";
      state.upiId = "";
      state.bankDetails = {
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      };
      state.paymentStatus = null;
      state.remarks = "";
    },
    requestReimbursementStart(state) {
      state.loading = true;
    },
    requestReimbursementSuccess(state, action) {
      state.claims = state.claims.map((claim) =>
        claim._id === action.payload._id ? action.payload : claim
      );
      state.loading = false;
      state.paymentStatus = "success";
      state.paymentModalOpen = false;
    },
    requestReimbursementFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.paymentStatus = "failed";
    },
    setSelectedClaim(state, action) {
      state.selectedClaim = action.payload;
    },
    setSelectedReceipt(state, action) {
      state.selectedReceipt = action.payload;
    },
    setReceiptOpen(state, action) {
      state.receiptOpen = action.payload;
    },
    setDetailDialogOpen(state, action) {
      state.detailDialogOpen = action.payload;
    },
    setPaymentModalOpen(state, action) {
      state.paymentModalOpen = action.payload;
    },
    resetSelectedClaim(state) {
      state.selectedClaim = null;
    },

    // New reducers for claim form
    setClaimFormStep(state, action) {
      state.claimForm.step = action.payload;
    },
    updateEmployeeInfo(state, action) {
      state.claimForm.employeeInfo = {
        ...state.claimForm.employeeInfo,
        ...action.payload,
      };
    },
    updateTravelDetails(state, action) {
      state.claimForm.travelDetails = {
        ...state.claimForm.travelDetails,
        ...action.payload,
      };
    },
    updateExpenses(state, action) {
      state.claimForm.expenses = action.payload;
    },
    submitClaimStart(state) {
      state.claimForm.submitStatus = "loading";
      state.claimForm.submitError = null;
    },
    submitClaimSuccess(state) {
      state.claimForm.submitStatus = "succeeded";
      state.claimForm.step = 0;
      state.claimForm.employeeInfo = initialState.claimForm.employeeInfo;
      state.claimForm.travelDetails = initialState.claimForm.travelDetails;
      state.claimForm.expenses = initialState.claimForm.expenses;
    },
    submitClaimFailure(state, action) {
      state.claimForm.submitStatus = "failed";
      state.claimForm.submitError = action.payload;
    },
    resetClaimForm(state) {
      state.claimForm = initialState.claimForm;
    },
  },
});

export const {
  fetchClaimsStart,
  fetchClaimsSuccess,
  fetchClaimsFailure,
  setViewMode,
  setPaymentMethod,
  setUpiId,
  setBankDetails,
  setPaymentStatus,
  setRemarks,
  resetPaymentState,
  requestReimbursementStart,
  requestReimbursementSuccess,
  requestReimbursementFailure,
  setSelectedClaim,
  setSelectedReceipt,
  setReceiptOpen,
  setDetailDialogOpen,
  setPaymentModalOpen,
  resetSelectedClaim,
  setClaimFormStep,
  updateEmployeeInfo,
  updateTravelDetails,
  updateExpenses,
  submitClaimStart,
  submitClaimSuccess,
  submitClaimFailure,
  resetClaimForm,
} = employeeClaimSlice.actions;

export default employeeClaimSlice.reducer;
