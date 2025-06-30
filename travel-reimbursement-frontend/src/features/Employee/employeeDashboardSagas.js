import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchClaimsStart,
  fetchClaimsSuccess,
  fetchClaimsFailure,
  requestReimbursementStart,
  requestReimbursementSuccess,
  requestReimbursementFailure,
  downloadPdfStart,
  downloadPdfSuccess,
  downloadPdfFailure,
} from './employeeDashboardSlice';

const BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";

// Helper function to get token from your existing auth state
const getToken = (state) => state.auth.user?.token;

function* fetchClaims() {
  try {
    const token = yield select(getToken);
    
    if (!token) {
      yield put(fetchClaimsFailure('Authentication required'));
      return;
    }

    const response = yield call(
      axios.get,
      `${BASE_URL}/employee/claims`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    yield put(fetchClaimsSuccess(response.data));
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    yield put(fetchClaimsFailure(errorMsg));
  }
}

function* requestReimbursement(action) {
  try {
    const token = yield select(getToken);
    if (!token) {
      yield put(requestReimbursementFailure('Authentication required'));
      return;
    }

    const { claimId, paymentDetails } = action.payload;
    const response = yield call(
      axios.patch,
      `${BASE_URL}/claims/${claimId}/request-reimbursement`,
      paymentDetails,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    yield put(requestReimbursementSuccess(response.data));
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    yield put(requestReimbursementFailure(errorMsg));
  }
}

function* downloadPdf(action) {
  try {
    const token = yield select(getToken);
    if (!token) {
      yield put(downloadPdfFailure('Authentication required'));
      return;
    }

    const { claimId } = action.payload;
    const response = yield call(
      axios.get,
      `${BASE_URL}/claims/${claimId}/pdf`,
      {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `claim_${claimId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    yield put(downloadPdfSuccess());
  } catch (error) {
    yield put(downloadPdfFailure(error.message));
  }
}

export function* employeeDashboardSaga() {
  yield takeLatest(fetchClaimsStart.type, fetchClaims);
  yield takeLatest(requestReimbursementStart.type, requestReimbursement);
  yield takeLatest(downloadPdfStart.type, downloadPdf);
}
