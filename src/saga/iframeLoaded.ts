import { PayloadAction } from '@reduxjs/toolkit'
import { call, select, takeEvery } from 'redux-saga/effects'
import { selectScreenById } from '../reducers/app'
import { iframeLoaded } from '../reducers/runtime'
import { sendMessageToScreens } from './utils/sendMessageToScreens'

function* doIframeLoaded(action: PayloadAction<string>): unknown {
  const screen = yield select(state => selectScreenById(state, action.payload))

  yield call(sendMessageToScreens, [screen], {
    message: '@APP/READY',
  })
}

export default function* rootSaga() {
  yield takeEvery(iframeLoaded.toString(), doIframeLoaded)
}
