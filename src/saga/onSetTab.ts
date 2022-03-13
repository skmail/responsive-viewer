import { PayloadAction } from '@reduxjs/toolkit'
import { put, select, takeLatest } from 'redux-saga/effects'
import {
  selectScreensByTab,
  selectTabByIndex,
  setTabByIndex,
} from '../reducers/app'
import {
  replaceScreensRuntime,
  ScreenRuntime,
  selectSreensRuntime,
} from '../reducers/runtime'
import { Device } from '../types'

function* doToggleScreenRuntime(action: PayloadAction<number>) {
  const screens: Device[] = yield select(state =>
    selectScreensByTab(state, selectTabByIndex(state, action.payload).name)
  )

  const screensRunTime: Record<string, ScreenRuntime> = yield select(
    selectSreensRuntime
  )
  yield put(
    replaceScreensRuntime(
      screens.reduce((acc: Record<string, ScreenRuntime>, screen: Device) => {
        const screenRuntime = screensRunTime[screen.id]
        if (screenRuntime) {
          acc[screen.id] = screenRuntime
        }
        return acc
      }, {})
    )
  )
}
export default function* rootSaga() {
  yield takeLatest(setTabByIndex.toString(), doToggleScreenRuntime)
}
