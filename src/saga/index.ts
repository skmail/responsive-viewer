import { fork } from 'redux-saga/effects'

import autoSave from './autoSave'
import backgroundCommunications from './backgroundCommunications'
import appExport from './appExport'
import appImport from './appImport'
import appReset from './appReset'
import iframeCommunications from './iframeCommunications'
import screenshot from './screenshot'
import initialize from './initialize'
import mouseInspect from './mouseInspect'
import screenScroll from './screenScroll'
import searchElement from './searchElement'
import fillUserAgent from './fillUserAgent'

export default function* rootSaga() {
  yield fork(autoSave)
  yield fork(backgroundCommunications)
  yield fork(appExport)
  yield fork(appImport)
  yield fork(appReset)
  yield fork(iframeCommunications)
  yield fork(screenshot)
  yield fork(initialize)
  yield fork(mouseInspect)
  yield fork(screenScroll)
  yield fork(searchElement)
  yield fork(fillUserAgent)
}
