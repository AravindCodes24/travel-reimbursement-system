import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        employeeId: action.payload.employeeId, // ✅ store employee ID here
        role: action.payload.role,
        token: action.payload.token,
      };
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.approvalPending = false;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.approvalPending = false;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
