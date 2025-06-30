import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchPendingUsersStart,
  fetchPendingUsersSuccess,
  fetchPendingUsersFailure,
  approveUserStart,
  approveUserSuccess,
  approveUserFailure,
  rejectUserStart,
  rejectUserSuccess,
  rejectUserFailure,
} from "../hr/hrUserSlice";

const BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";

function* fetchPendingUsers() {
  try {
    const token = localStorage.getItem("token");
    const response = yield call(
      axios.get,
      `${BASE_URL}/users/pending`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    yield put(fetchPendingUsersSuccess(response.data));
  } catch (error) {
    yield put(fetchPendingUsersFailure(error.message));
  }
}

function* approveUser(action) {
  try {
    const token = localStorage.getItem("token");
    yield call(
      axios.patch,
      `${BASE_URL}/users/approve/${action.payload}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    yield put(approveUserSuccess(action.payload));
  } catch (error) {
    yield put(approveUserFailure(error.message));
  }
}

function* rejectUser(action) {
  try {
    const token = localStorage.getItem("token");
    yield call(
      axios.patch,
      `${BASE_URL}/users/reject/${action.payload}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    yield put(rejectUserSuccess(action.payload));
  } catch (error) {
    yield put(rejectUserFailure(error.message));
  }
}

export function* hrUserSaga() {
  yield takeLatest(fetchPendingUsersStart.type, fetchPendingUsers);
  yield takeLatest(approveUserStart.type, approveUser);
  yield takeLatest(rejectUserStart.type, rejectUser);
}
