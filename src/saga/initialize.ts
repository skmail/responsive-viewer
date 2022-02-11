import { call, delay, put, select, takeLatest } from 'redux-saga/effects'
import platform from '../platform'
import { initialize, initialized, selectApp, State } from '../reducers/app'

import { loadState } from '../utils/state'

function* doInitialize(): unknown {
  let state: State = {
    ...(yield select(selectApp)),
    ...(yield call(loadState)),
  }

  const tabUrl = window.location.href
  // const tabUrl = 'http://localhost:3000/'

  yield call(platform.runtime.sendMessage, {
    message: 'LOAD_STATE',
    state: state,
  })

  yield delay(1500)

  yield put(
    initialized({
      ...state,
      url: tabUrl || state.url,
    })
  )
}

export default function* rootSaga() {
  yield takeLatest(initialize.toString(), doInitialize)
}
