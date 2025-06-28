import { takeLatest, call, put } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
} from "./authSlice";
import { loginApi, registerApi } from "./authAPI";

function* handleLogin(action) {
  try {
    const response = yield call(loginApi, action.payload);
    const user = response.data.data;

    console.log("Login Success, user:", user);

    yield put(loginSuccess(user)); // ✅ triggers LoginForm.jsx useEffect
  } catch (error) {
    yield put(loginFailure(error.response?.data?.message || "Login failed"));
  }
}

function* handleRegister(action) {
  try {
    const response = yield call(registerApi, action.payload);
    yield put(registerSuccess(response.data));
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Registration failed";
    yield put(registerFailure(message));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
}
