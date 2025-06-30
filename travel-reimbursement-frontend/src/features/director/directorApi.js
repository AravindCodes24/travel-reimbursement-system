import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";

export const fetchDirectorClaimsApi = async () => {
  const response = await axios.get(`${BASE_URL}/claims`);
  const claims = response.data;

  // Calculate stats
  const stats = claims.reduce(
    (acc, claim) => {
      acc.total++;
      if (claim.status === "Approved") acc.approved++;
      else if (claim.status === "Paid") acc.paid++;
      else if (claim.status === "Rejected") acc.rejected++;
      else if (claim.status === "Forwarded") acc.pending++;
      return acc;
    },
    { total: 0, approved: 0, rejected: 0, pending: 0, paid: 0 }
  );

  return { claims, stats };
};

export const updateDirectorClaimStatusApi = async ({ claimId, status }) => {
  const response = await axios.put(`${BASE_URL}/claims/${claimId}/status`, {
    status,
  });
  return response.data;
};
