import axios from "axios";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// Get all claims for Office Dashboard
export const getOfficeClaimsApi = async () => {
  const res = await axios.get("/api/claims", config);
  return res.data;
};

// Mark claim as reimbursed (if needed separately)
export const markClaimAsReimbursedApi = async (claimId) => {
  const res = await axios.patch(
    `/api/claims/${claimId}/mark-reimbursed`,
    {},
    config
  );
  return res.data;
};

// Mark claim as fully paid (with details)
export const markClaimAsPaidApi = async (claimId, payload) => {
  const res = await axios.patch(`/api/claims/${claimId}/mark-paid`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};

// Update payment status (optional step)
export const updatePaymentStatusApi = async (claimId, payload) => {
  const res = await axios.patch(
    `/api/office/${claimId}/payment-status`,
    payload,
    config
  );
  return res.data;
};

// initiate payout from frontend
export const initiateCashfreePayout = async (payload) => {
  try {
    const response = await axios.post("/api/payouts/cashfree", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
