import { PayloadAction } from '@reduxjs/toolkit'
import { put, select, takeLatest } from 'redux-saga/effects'
import { saveUserAgent } from '../reducers/app'
import {
  selectScreenDialog,
  updateScreenDialogValues,
} from '../reducers/layout'

import { UserAgent } from '../types'

function* doFillUserAgentInScreenDialog({
  payload: userAgent,
}: PayloadAction<UserAgent>): unknown {
  const screenDialog = yield select(selectScreenDialog)

  if (!screenDialog.open) {
    return
  }

  yield put(
    updateScreenDialogValues({
      userAgent: userAgent.name,
    })
  )
}

export default function* rootSaga() {
  yield takeLatest(saveUserAgent.toString(), doFillUserAgentInScreenDialog)
}
