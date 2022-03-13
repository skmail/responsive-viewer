import { call, put, takeLatest } from 'redux-saga/effects'
import { initialize, appReset } from '../reducers/app'
import { resetState } from '../utils/state'

function* doAppReset() {
  yield call(resetState)

  yield put(initialize())
}

export default function* rootSaga() {
  yield takeLatest(appReset.toString(), doAppReset)
}
