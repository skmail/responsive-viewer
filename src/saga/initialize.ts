import { call, put, select, takeLatest } from 'redux-saga/effects'
import platform from '../platform'
import { initialize, initialized, selectApp, State } from '../reducers/app'
import { getPrefixedMessage } from '../utils/getPrefixedMessage'

import { loadState } from '../utils/state'
import { validateAppState } from '../utils/validateAppState'

function* doInitialize(): unknown {
  let loadedState: Partial<State>

  try {
    loadedState = yield call(loadState)
    loadedState = validateAppState(loadedState)
  } catch (error) {
    loadedState = {}
  }
  let state: State = {
    ...(yield select(selectApp)),
    ...loadedState,
  }

  const tabUrl = window.location.href

  yield call(platform.runtime.sendMessage, {
    message: getPrefixedMessage('LOAD_STATE'),
    state: state,
  })

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
