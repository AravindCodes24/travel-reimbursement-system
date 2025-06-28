// hrClaimSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pendingClaims: [],
  loading: false,
  error: null,
  filter: "all",
};

const hrClaimSlice = createSlice({
  name: "hrClaim",
  initialState,
  reducers: {
    fetchPendingClaimsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPendingClaimsSuccess(state, action) {
      state.pendingClaims = action.payload;
      state.loading = false;
    },
    fetchPendingClaimsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    approveClaimStart(state, action) {
      state.loading = true;
    },
    approveClaimSuccess(state, action) {
      state.pendingClaims = state.pendingClaims.map((claim) =>
        claim._id === action.payload._id ? action.payload : claim
      );
      state.loading = false;
    },
    approveClaimFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    rejectClaimStart(state, action) {
      state.loading = true;
    },
    rejectClaimSuccess(state, action) {
      state.pendingClaims = state.pendingClaims.map((claim) =>
        claim._id === action.payload._id ? action.payload : claim
      );
      state.loading = false;
    },
    rejectClaimFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    forwardClaimStart(state, action) {
      state.loading = true;
    },
    forwardClaimSuccess(state, action) {
      state.pendingClaims = state.pendingClaims.map((claim) =>
        claim._id === action.payload._id ? action.payload : claim
      );
      state.loading = false;
    },
    forwardClaimFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setClaimFilter(state, action) {
      state.filter = action.payload;
    },
    setClaimSortConfig(state, action) {
      state.sortConfig = action.payload;
    },
  },
});

export const {
  fetchPendingClaimsStart,
  fetchPendingClaimsSuccess,
  fetchPendingClaimsFailure,
  approveClaimStart,
  approveClaimSuccess,
  approveClaimFailure,
  rejectClaimStart,
  rejectClaimSuccess,
  rejectClaimFailure,
  forwardClaimStart,
  forwardClaimSuccess,
  forwardClaimFailure,
  setClaimFilter,
  setClaimSortConfig,
} = hrClaimSlice.actions;

export default hrClaimSlice.reducer;
