import { all, fork } from "redux-saga/effects";
import authSaga from "../features/auth/authSaga";

import { employeeClaimSaga } from "../features/Employee/employeeClaimSaga";
import { employeeDashboardSaga } from "../features/Employee/employeeDashboardSagas";

import { hrUserSaga } from "../features/hr/hrUserSaga";
import { hrClaimSaga } from "../features/hr/hrClaimSaga";

import { DirectorSaga } from "../features/director/directorSaga";

import officeSaga from "../features/office/officeSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    fork(employeeClaimSaga),
    fork(employeeDashboardSaga),
    hrUserSaga(),
    fork(hrClaimSaga),
    fork(DirectorSaga),
    fork(officeSaga)
  ]);
}
