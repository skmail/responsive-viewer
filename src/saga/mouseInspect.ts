import { call, put, select, takeLatest } from 'redux-saga/effects'
import {
  appSaved,
  selectScreensByTab,
  selectSelectedTab,
} from '../reducers/app'
import { selectMouseInspect, toggleMouseInspect } from '../reducers/layout'
import { sendMessageToScreens } from './utils/sendMessageToScreens'

function* doInspectByMouse(): unknown {
  const mouseInspect = yield select(selectMouseInspect)
  const screens = yield select(state =>
    selectScreensByTab(state, selectSelectedTab(state))
  )
  if (mouseInspect) {
    yield call(sendMessageToScreens, screens, {
      message: '@APP/ENABLE_MOUSE_INSPECTOR',
    })
  } else {
    yield call(sendMessageToScreens, screens, {
      message: '@APP/DISABLE_MOUSE_INSPECTOR',
    })
  }
}

function* doTurnOffInspectByMouse() {
  const mouseInspect: boolean = yield select(selectMouseInspect)

  if (mouseInspect) {
    yield put(toggleMouseInspect(false))
  }
}

export default function* rootSaga() {
  yield takeLatest(toggleMouseInspect.toString(), doInspectByMouse)
  yield takeLatest(appSaved.toString(), doTurnOffInspectByMouse)
}
