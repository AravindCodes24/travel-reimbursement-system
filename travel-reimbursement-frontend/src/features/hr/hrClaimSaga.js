// hrClaimSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
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
} from "../hr/hrClaimSlice";

function* fetchPendingClaims() {
  try {
    const token = localStorage.getItem("token");
    const response = yield call(axios.get, "http://localhost:5000/api/claims", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Filter claims
    const filteredClaims = response.data.filter((claim) =>
      ["Pending", "Forwarded", "Approved", "Rejected", "Paid"].includes(
        claim.status
      )
    );

    yield put(fetchPendingClaimsSuccess(filteredClaims));
  } catch (error) {
    yield put(fetchPendingClaimsFailure(error.message));
  }
}
function* approveClaim(action) {
  try {
    const token = localStorage.getItem("token");
    const response = yield call(
      axios.put,
      `http://localhost:5000/api/claims/${action.payload}/status`,
      { status: "Approved" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    yield put(approveClaimSuccess(response.data));
  } catch (error) {
    yield put(approveClaimFailure(error.message));
  }
}

function* rejectClaim(action) {
  try {
    const token = localStorage.getItem("token");
    const response = yield call(
      axios.put,
      `http://localhost:5000/api/claims/${action.payload}/status`,
      { status: "Rejected" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    yield put(rejectClaimSuccess(response.data));
  } catch (error) {
    yield put(rejectClaimFailure(error.message));
  }
}
function* forwardClaim(action) {
  try {
    const token = localStorage.getItem("token");
    const response = yield call(
      axios.put,
      `http://localhost:5000/api/claims/${action.payload}/status`,
      { status: "Forwarded" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    yield put(forwardClaimSuccess(response.data));
  } catch (error) {
    yield put(forwardClaimFailure(error.message));
  }
}
export function* hrClaimSaga() {
  yield takeLatest(fetchPendingClaimsStart.type, fetchPendingClaims);
  yield takeLatest(approveClaimStart.type, approveClaim);
  yield takeLatest(rejectClaimStart.type, rejectClaim);
  yield takeLatest(forwardClaimStart.type, forwardClaim);
}
