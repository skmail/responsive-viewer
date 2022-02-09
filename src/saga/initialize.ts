import { call, put, select, takeLatest } from 'redux-saga/effects'
import platform from '../platform'
import { initialize, initialized, selectApp, State } from '../reducers/app'

import { loadState } from '../utils/state'

function* doInitialize(): unknown {
  let state: State = {
    ...(yield select(selectApp)),
    ...(yield call(loadState)),
  }

  // const tabUrl = window.location.href
  const tabUrl = 'http://localhost:3000/'

  yield call(platform.runtime.sendMessage, {
    message: 'LOAD_STATE',
    state: state,
  })

  yield put(
    initialized({
      ...state,
      url: tabUrl || state.url,
      versionedUrl: tabUrl || state.url,
    })
  )
}

export default function*() {
  yield takeLatest(initialize.toString(), doInitialize)
}
