import { PayloadAction } from '@reduxjs/toolkit'
import { call, select, takeLatest } from 'redux-saga/effects'
import { selectScreensByTab, selectSelectedTab } from '../reducers/app'
import { searchElement } from '../reducers/layout'
import { Device } from '../types'
import { sendMessageToScreens } from './utils/sendMessageToScreens'

function* doSearchElement({ payload: selector }: PayloadAction<string>) {
  const screens: Device[] = yield select(state =>
    selectScreensByTab(state, selectSelectedTab(state))
  )

  yield call(sendMessageToScreens, screens, {
    message: 'SCROLL_TO_ELEMENT',
    path: selector,
  })
}

export default function* rootSaga() {
  yield takeLatest(searchElement, doSearchElement)
}
