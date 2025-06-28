import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import authReducer from "../features/auth/authSlice";

import employeeClaimReducer from "../features/Employee/employeeClaimSlice";
import employeeDashboardReducer from '../features/Employee/employeeDashboardSlice';

import hrUserReducer from "../features/hr/hrUserSlice"; // HR - user approval
import hrClaimReducer from "../features/hr/hrClaimSlice"; // HR - claim approval

import directorReducer from "../features/director/directorSlice"; // Director dashboard
import officeReducer from "../features/office/officeSlice"; // Office dashboard

import rootSaga from "./rootsaga";

// saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
const store = configureStore({
  reducer: {
    auth: authReducer,

    employeeClaim: employeeClaimReducer,
    employeeDashboard: employeeDashboardReducer,
 
    userApproval: hrUserReducer,
    hrClaim: hrClaimReducer,

    director: directorReducer,
    office: officeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// Run sagas
sagaMiddleware.run(rootSaga);

export default store;
