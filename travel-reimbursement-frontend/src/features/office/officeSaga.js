import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchOfficeClaims,
  fetchOfficeClaimsSuccess,
  fetchOfficeClaimsFailure,
} from "./officeSlice";
import { getOfficeClaimsApi } from "../../features/office/officeApi";

function* handleFetchOfficeClaims() {
  try {
    const data = yield call(getOfficeClaimsApi);
    yield put(fetchOfficeClaimsSuccess(data));
  } catch (error) {
    console.error("Error fetching office claims:", error.message);
    yield put(fetchOfficeClaimsFailure(error.message));
  }
}
export default function* officeSaga() {
  yield takeLatest(fetchOfficeClaims.type, handleFetchOfficeClaims);
}
