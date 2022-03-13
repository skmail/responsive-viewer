import { select, takeLatest, put } from 'redux-saga/effects'
import {
  selectScreensByTab,
  selectSelectedTab,
  updateZoom,
} from '../reducers/app'
import { zoomToFit } from '../reducers/layout'
import { RootState } from '../store'
import { Device } from '../types'

export function* doZoomToFit() {
  const screens: Device[] = yield select((state: RootState) =>
    selectScreensByTab(state, selectSelectedTab(state))
  )

  const screensWidth = screens.reduce(
    (acc, screen) => screen.width + 32 + acc,
    0
  )
  const maxHeight = screens.reduce(
    (acc, screen) => Math.max(screen.height, acc),
    0
  )

  const root = document.getElementById('screens-wrapper')

  const box = root?.getBoundingClientRect()

  if (!box) {
    return
  }

  yield put(
    updateZoom(
      Math.min((box.width - 20) / screensWidth, (box.height - 80) / maxHeight)
    )
  )
}
export default function* rootSaga() {
  yield takeLatest(zoomToFit.toString(), doZoomToFit)
}
