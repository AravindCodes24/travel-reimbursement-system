import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";
const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// Get all claims for Office Dashboard
export const getOfficeClaimsApi = async () => {
  const res = await axios.get(`${BASE_URL}/claims`, config);
  return res.data;
};

// Mark claim as reimbursed
export const markClaimAsReimbursedApi = async (claimId) => {
  const res = await axios.patch(`${BASE_URL}/claims/${claimId}/mark-reimbursed`, {}, config);
  return res.data;
};

// Mark claim as fully paid
export const markClaimAsPaidApi = async (claimId, payload) => {
  const res = await axios.patch(`${BASE_URL}/claims/${claimId}/mark-paid`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Update payment status
export const updatePaymentStatusApi = async (claimId, payload) => {
  const res = await axios.patch(`${BASE_URL}/office/${claimId}/payment-status`, payload, config);
  return res.data;
};

// Initiate Cashfree payout
export const initiateCashfreePayout = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/payouts/cashfree`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Cashfree payout error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};



