import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  claims: [],
  loading: false,
  error: null,
  actionLoading: null,
  stats: {
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    paid: 0,
  },
};

const directorSlice = createSlice({
  name: "director",
  initialState,
  reducers: {
    fetchDirectorClaimsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDirectorClaimsSuccess: (state, action) => {
      state.loading = false;
      state.claims = action.payload.claims;
      state.stats = action.payload.stats;
    },
    fetchDirectorClaimsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateClaimStatusRequest: (state, action) => {
      state.actionLoading = action.payload.claimId + action.payload.status;
    },
    updateClaimStatusSuccess: (state, action) => {
      const updatedClaim = action.payload;
      state.claims = state.claims.map(claim =>
        claim._id === updatedClaim._id ? updatedClaim : claim
      );
      state.actionLoading = null;
      
      // Update stats
      const newStats = { ...state.stats };
      if (updatedClaim.status === "Approved") newStats.approved++;
      if (updatedClaim.status === "Rejected") newStats.rejected++;
      if (updatedClaim.status === "Forwarded") newStats.pending++;
      if (updatedClaim.status === "Paid") newStats.paid++;
      
      state.stats = newStats;
    },
    updateClaimStatusFailure: (state) => {
      state.actionLoading = null;
    },
  },
});

export const {
  fetchDirectorClaimsRequest,
  fetchDirectorClaimsSuccess,
  fetchDirectorClaimsFailure,
  updateClaimStatusRequest,
  updateClaimStatusSuccess,
  updateClaimStatusFailure,
} = directorSlice.actions;

export default directorSlice.reducer;