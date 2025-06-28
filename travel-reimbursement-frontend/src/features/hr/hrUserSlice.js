import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pendingUsers: [],
  loading: false,
  error: null,
  sortConfig: { key: "createdAt", direction: "desc" },
};

const userApprovalSlice = createSlice({
  name: "userApproval",
  initialState,
  reducers: {
    fetchPendingUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPendingUsersSuccess(state, action) {
      state.pendingUsers = action.payload;
      state.loading = false;
    },
    fetchPendingUsersFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    approveUserStart(state, action) {
      state.loading = true;
    },
    approveUserSuccess(state, action) {
      state.pendingUsers = state.pendingUsers.filter(
        (user) => user._id !== action.payload
      );
      state.loading = false;
    },
    approveUserFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    rejectUserStart(state, action) {
      state.loading = true;
    },
    rejectUserSuccess(state, action) {
      state.pendingUsers = state.pendingUsers.filter(
        (user) => user._id !== action.payload
      );
      state.loading = false;
    },
    rejectUserFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setSortConfig(state, action) {
      state.sortConfig = action.payload;
    },
  },
});

export const {
  fetchPendingUsersStart,
  fetchPendingUsersSuccess,
  fetchPendingUsersFailure,
  approveUserStart,
  approveUserSuccess,
  approveUserFailure,
  rejectUserStart,
  rejectUserSuccess,
  rejectUserFailure,
  setSortConfig,
} = userApprovalSlice.actions;

export default userApprovalSlice.reducer;
