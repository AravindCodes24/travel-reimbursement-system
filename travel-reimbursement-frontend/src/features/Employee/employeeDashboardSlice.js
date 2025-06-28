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
};

const employeeDashboardSlice = createSlice({
  name: "employeeDashboard",
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
    requestReimbursementStart(state, action) {
      state.loading = true;
      state.paymentStatus = "initiating";
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
    downloadPdfStart(state) {
      state.loading = true;
    },
    downloadPdfSuccess(state) {
      state.loading = false;
    },
    downloadPdfFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
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
  downloadPdfStart,
  downloadPdfSuccess,
  downloadPdfFailure,
} = employeeDashboardSlice.actions;

export default employeeDashboardSlice.reducer;