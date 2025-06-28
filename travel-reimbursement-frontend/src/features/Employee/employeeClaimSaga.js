import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchClaimsStart,
  fetchClaimsSuccess,
  fetchClaimsFailure,
  requestReimbursementStart,
  requestReimbursementSuccess,
  requestReimbursementFailure,
  submitClaimStart,
  submitClaimSuccess,
  submitClaimFailure
} from '../Employee/employeeClaimSlice';

function* fetchClaims() {
  try {
    const token = localStorage.getItem('token');
    const response = yield call(
      axios.get,
      'http://localhost:5000/api/employee/claims',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    yield put(fetchClaimsSuccess(response.data));
  } catch (error) {
    yield put(fetchClaimsFailure(error.message));
  }
}

function* requestReimbursement(action) {
  try {
    const { claimId, paymentDetails } = action.payload;
    const token = localStorage.getItem('token');
    const response = yield call(
      axios.patch,
      `http://localhost:5000/api/claims/${claimId}/request-reimbursement`,
      paymentDetails,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    yield put(requestReimbursementSuccess(response.data));
  } catch (error) {
    yield put(requestReimbursementFailure(error.response?.data?.error || error.message));
  }
}

function* submitClaim(action) {
  try {
    const { employeeInfo, travelDetails, expenses } = action.payload;
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('employeeInfo', JSON.stringify(employeeInfo));
    formData.append('travelDetails', JSON.stringify(travelDetails));
    formData.append('expenses', JSON.stringify(expenses));
    
    expenses.forEach((expense) => {
      if (expense.receiptFile) {
        formData.append('receipts', expense.receiptFile);
      }
    });

    yield call(
      axios.post,
      'http://localhost:5000/api/claim',
      formData,
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    yield put(submitClaimSuccess());
  } catch (error) {
    yield put(submitClaimFailure(error.message));
  }
}

export function* employeeClaimSaga() {
  yield takeLatest(fetchClaimsStart.type, fetchClaims);
  yield takeLatest(requestReimbursementStart.type, requestReimbursement);
  yield takeLatest(submitClaimStart.type, submitClaim);
}