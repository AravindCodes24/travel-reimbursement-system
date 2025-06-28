// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Layout from "../components/layouts/Layout";

import ClaimPage from "../pages/ClaimPage";
import EmployeeHome from "../components/EmployeeClaimForm/EmployeeHome";

import MultiStepClaimForm from "../components/EmployeeClaimForm/MultiStepClaimForm";
import EmployeeClaimDashboard from "../components/EmployeeClaimForm/EmployeeClaimDashboard";

import HrDashboard from "../components/hr/HrDashboard";
import HrUserApprovalDashboard from "../components/hr/HrUserApprovalDashboard";
import HrClaimApprovalDashboard from "../components/hr/HrClaimApprovalDashboard";

import DirectorDashboard from "../components/Director/DirectorDashboard";
import OfficeDashboard from "../components/OfficeMangement/OfficeDashboard";
const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Layout>
          <LoginPage />
        </Layout>
      }
    />
    <Route
      path="/register"
      element={
        <Layout>
          <RegisterPage />
        </Layout>
      }
    />
    <Route
      path="/employee/home"
      element={
        <Layout>
          <EmployeeHome />
        </Layout>
      }
    />
    <Route
      path="/employee/claim"
      element={
        <Layout>
          <MultiStepClaimForm />
        </Layout>
      }
    />
    <Route
      path="/employee/dashboard"
      element={
        <Layout>
          <EmployeeClaimDashboard />
        </Layout>
      }
    />
    <Route
      path="/submit-claim"
      element={
        <Layout>
          <ClaimPage />
        </Layout>
      }
    />
    <Route
      path="/hr/dashboard"
      element={
        <Layout>
          <HrDashboard />
        </Layout>
      }
    />
    <Route
      path="/hr/users"
      element={
        <Layout>
          <HrUserApprovalDashboard />
        </Layout>
      }
    />
    <Route
      path="/hr/claims"
      element={
        <Layout>
          <HrClaimApprovalDashboard />
        </Layout>
      }
    />
    <Route
      path="/director/dashboard"
      element={
        <Layout>
          <DirectorDashboard />
        </Layout>
      }
    />

    <Route
      path="/office/dashboard"
      element={
        <Layout>
          <OfficeDashboard />
        </Layout>
      }
    />

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
