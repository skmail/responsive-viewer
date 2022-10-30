import { PayloadAction } from '@reduxjs/toolkit'
import { call, fork, select, take, put } from 'redux-saga/effects'
import platform from '../platform'
import {
  initialized,
  appSaved,
  selectApp,
  State,
  initialize,
  exportApp,
  importApp,
} from '../reducers/app'
import { getPrefixedMessage } from '../utils/getPrefixedMessage'
import { saveState } from '../utils/state'

function* doWatchAllAction(): unknown {
  while (true) {
    const action: PayloadAction = yield take('*')
    if (
      action.type.startsWith('app') &&
      action.type !== initialized.toString() &&
      action.type !== initialize.toString() &&
      action.type !== importApp.toString() &&
      action.type !== exportApp.toString() &&
      action.type !== appSaved.toString()
    ) {
      yield fork(doSaveToState)
      yield call(platform.runtime.sendMessage, {
        message: getPrefixedMessage('LOAD_STATE'),
        state: yield select(selectApp),
      })
    }
    yield fork(notifyAdvertisment, action)
  }
}

function* notifyAdvertisment(action: PayloadAction) {
  const advertismentIframe: HTMLIFrameElement = yield call(
    { context: document, fn: document.getElementById },
    'bannerIframe'
  )

  if (!advertismentIframe || !advertismentIframe.contentWindow) {
    return
  }

  yield call<any>(
    advertismentIframe.contentWindow.postMessage.bind(
      advertismentIframe.contentWindow
    ),
    {
      action: action.type,
    },
    '*'
  )
}

function* doSaveToState() {
  const state: State = yield select(selectApp)
  yield call(saveState, state)

  yield call(platform.runtime.sendMessage, {
    message: 'LOAD_STATE',
    state: state,
  })

  yield put(appSaved())
}

export default function* rootSaga() {
  yield doWatchAllAction()
}
