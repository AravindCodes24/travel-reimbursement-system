import { createSlice } from "@reduxjs/toolkit";

const officeSlice = createSlice({
  name: "office",
  initialState: {
    claims: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchOfficeClaims: (state) => {
      state.loading = true;
      state.error = null; // Clear previous error if any
    },
    fetchOfficeClaimsSuccess: (state, action) => {
      state.loading = false;
      state.claims = action.payload;
    },
    fetchOfficeClaimsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Optional: Clear state (e.g., on logout)
    resetOfficeState: (state) => {
      state.claims = [];
      state.loading = false;
      state.error = null;
    },
  },
});
export const {
  fetchOfficeClaims,
  fetchOfficeClaimsSuccess,
  fetchOfficeClaimsFailure,
  resetOfficeState,
} = officeSlice.actions;

export default officeSlice.reducer;
