import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchDirectorClaimsRequest,
  fetchDirectorClaimsSuccess,
  fetchDirectorClaimsFailure,
  updateClaimStatusRequest,
  updateClaimStatusSuccess,
  updateClaimStatusFailure,
} from "./directorSlice";
import {
  fetchDirectorClaimsApi,
  updateDirectorClaimStatusApi,
} from "./directorApi";

function* fetchDirectorClaims() {
  try {
    const { claims, stats } = yield call(fetchDirectorClaimsApi);
    yield put(fetchDirectorClaimsSuccess({ claims, stats }));
  } catch (error) {
    yield put(fetchDirectorClaimsFailure(error.message));
  }
}

function* updateClaimStatus(action) {
  try {
    const { claimId, status } = action.payload;
    const updatedClaim = yield call(updateDirectorClaimStatusApi, { claimId, status });
    yield put(updateClaimStatusSuccess(updatedClaim));
  } catch (error) {
    yield put(updateClaimStatusFailure(error.message));
  }
}

export function* DirectorSaga() {
  yield takeLatest(fetchDirectorClaimsRequest.type, fetchDirectorClaims);
  yield takeLatest(updateClaimStatusRequest.type, updateClaimStatus);
}