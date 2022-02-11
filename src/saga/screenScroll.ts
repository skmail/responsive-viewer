import { PayloadAction } from '@reduxjs/toolkit'
import { call, delay, put, select, takeLatest } from 'redux-saga/effects'
import {
  saveScreen,
  selectScreensByTab,
  selectSelectedTab,
} from '../reducers/app'

import {
  scrollToScreen,
  highlightScreen,
  dehighlightScreen,
} from '../reducers/layout'
import { Device } from '../types'
import { getDomId } from '../utils/screen'
import { scrollToElement } from '../utils/scrollToElement'

function* doScrollToScreen({ payload: id }: PayloadAction<string>) {
  const iframeId: string = yield call(getDomId, id)

  const element: HTMLDivElement = yield call(
    { context: document, fn: document.getElementById },
    iframeId
  )

  if (!element) {
    return
  }

  yield call(scrollToElement, element)

  yield put(highlightScreen(id))

  yield delay(400)

  yield put(dehighlightScreen())
}

function* doScrollAfterScreenSaved({
  payload,
}: PayloadAction<{ screen: Device }>) {
  const {
    screen: { id },
  } = payload

  const screens: Device[] = yield select(state =>
    selectScreensByTab(state, selectSelectedTab(state))
  )

  const alreadyExists = screens.find(screen => screen.id === id)

  if (alreadyExists) {
    return
  }

  yield delay(100)

  yield put(scrollToScreen(id))
}

export default function* rootSaga() {
  yield takeLatest(scrollToScreen.toString(), doScrollToScreen)

  yield takeLatest(saveScreen.toString(), doScrollAfterScreenSaved)
}
