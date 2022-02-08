import platform from '../platform'
import { saveAs } from 'file-saver'
import {
  takeLatest,
  takeEvery,
  call,
  put,
  take,
  select,
  fork,
} from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import {
  scrollToScreen,
  highlightScreen,
  unHighlightScreen,
  initialize,
  initialized,
  appSaved,
  toggleInspectByMouse,
  refresh,
  updateUrl,
} from '../actions'
import screenshot from './screenshot'
import { getDomId } from '../utils/screen'
import { waitFor } from '../utils/saga'
import { NAME as APP_NAME, SCREEN_DIALOG_FORM_NAME } from '../constants'
import { saveState, loadState, resetState } from '../utils/state'
import { change as changeForm } from 'redux-form'
import actionTypes from '../actions/actionTypes'
import { getScreensByTab, getSelectedTab } from '../selectors'
import { iframeChannel } from './utils/iframeChannel'
import { sendMessageToScreens } from './utils/sendMessageToScreens'
import { scrollToElement } from './utils/scrollToElement'

const wait = ms =>
  new Promise(resolve =>
    platform.runtime.sendMessage({ message: 'WAIT', time: ms }, () => resolve())
  )

const doScrollToScreen = function*({ payload }) {
  const { id } = payload

  const iframeId = yield call(getDomId, id)

  const element = document.getElementById(iframeId)

  yield scrollToElement(element)

  yield put(highlightScreen(id))

  yield wait(400)

  yield put(unHighlightScreen(id))
}

function* doScrollAfterScreenSaved({ payload }) {
  const {
    screen: { id },
  } = payload

  const state = yield select()

  const alreadyExists = state.app.screens.find(screen => screen.id === id)

  if (alreadyExists) {
    return
  }

  yield call(waitFor, state =>
    state.app.screens.find(screen => screen.id === id)
  )

  yield wait(100)

  yield put(scrollToScreen(id))
}

function* doWatchAllAction() {
  while (true) {
    const action = yield take('*')
    if (action.type.startsWith(APP_NAME)) {
      yield fork(doSaveToState)
    }
    yield fork(notifyAdvertisment, action)
  }
}

function* notifyAdvertisment(action) {
  const advertismentIframe = document.getElementById('bannerIframe')
  if (advertismentIframe) {
    yield advertismentIframe.contentWindow.postMessage(
      {
        action: action.type,
      },
      '*'
    )
  }
}

function* doSaveToState() {
  const state = yield select()
  yield call(saveState, state.app)

  yield call(platform.runtime.sendMessage, {
    message: 'LOAD_STATE',
    state: state.app,
  })

  yield put(appSaved(state.app))
}

function* doInitialize() {
  const state = yield select()

  let app = yield call(loadState)

  app = app && typeof app === 'object' ? app : {}

  const screens = Array.isArray(app.screens) ? app.screens : state.app.screens

  if (Array.isArray(app.screens)) {
    const ids = screens.map(screen => screen.id)
    const names = screens.map(screen => screen.name)
    for (let screen of state.app.screens) {
      if (!ids.includes(screen.id) && !names.includes(screen.name)) {
        screens.push({
          ...screen,
          visible: false,
        })
      }
    }
  }
  // const tabUrl = window.location.href
  const tabUrl = 'http://localhost:3000/'

  app = {
    ...state.app,
    ...app,
    screens: screens.map(screen => ({
      ...screen,
      highlighted: false,
    })),
    url: tabUrl || app.url,
    versionedUrl: tabUrl || app.url,
  }

  yield call(platform.runtime.sendMessage, {
    message: 'LOAD_STATE',
    state: app,
  })

  yield put(initialized({ app }))
}

function* doFillUserAgentInScreenDialog({ payload }) {
  const { userAgent } = payload

  yield put(changeForm(SCREEN_DIALOG_FORM_NAME, 'userAgent', userAgent.name))
}

function* doIframeCommunications() {
  while (true) {
    const data = yield take(iframeChannel())

    const state = yield select()

    let allowedToSend = false

    yield put({
      type: `@IFRAME/${data.message}`,
    })

    switch (data.message) {
      case '@APP/FRAME_SCROLL':
        allowedToSend = state.app.syncScroll
        break

      case '@APP/CLICK':
        allowedToSend = state.app.syncClick
        break

      case '@APP/SCROLL_TO_ELEMENT':
        allowedToSend = true
        break

      case '@APP/DELEGATE_EVENT':
        allowedToSend = state.app.syncClick
        break

      case '@APP/REFRESH':
        yield put(refresh())
        break

      default:
        allowedToSend = false
    }

    if (allowedToSend) {
      sendMessageToScreens(getScreensByTab(state, getSelectedTab(state)), data)
    }
  }
}

function* doAppReset() {
  yield call(resetState)

  yield put(initialize())
}

function* doSearchElement(action) {
  const { payload } = action
  const { selector } = payload
  const state = yield select()

  sendMessageToScreens(getScreensByTab(state, getSelectedTab(state)), {
    message: '@APP/SCROLL_TO_ELEMENT',
    path: selector,
  })
}

function* doInspectByMouse() {
  const state = yield select()

  if (state.layout.inspectByMouse) {
    sendMessageToScreens(getScreensByTab(state, getSelectedTab(state)), {
      message: '@APP/ENABLE_MOUSE_INSPECTOR',
    })
  } else {
    sendMessageToScreens(getScreensByTab(state, getSelectedTab(state)), {
      message: '@APP/DISABLE_MOUSE_INSPECTOR',
    })
  }
}

function* doTurnOffInspectByMouse() {
  yield put(toggleInspectByMouse(false))
}

function* doBackgroundCommunications() {
  try {
    const waitForBackgroundMessages = eventChannel(emitter => {
      platform.runtime.onMessage.addListener(function(
        message,
        sender,
        sendResponse
      ) {
        sendResponse({})

        emitter(message)

        return true
      })

      return () => {}
    })

    while (true) {
      yield take(waitForBackgroundMessages)
    }
  } catch (error) {
    console.error('unable to comunicate')
  }
}

function* doExportApp() {
  const state = yield select()

  const { url, versionedUrl, initialized, ...toSave } = state.app

  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(toSave))

  saveAs(dataStr, 'responsive-viewer.json')
}

function* doImportApp(action) {
  const state = yield select()
  const newState = {
    ...state.app,
    ...action.payload.data,
  }
  yield call(saveState, newState)

  yield call(platform.runtime.sendMessage, {
    message: 'LOAD_STATE',
    state: newState,
  })

  yield put(appSaved(newState))
}

function* doRefresh() {
  const state = yield select()
  yield put(updateUrl(state.app.url))
}
export default function*() {
  yield takeEvery(actionTypes.SCROLL_TO_SCREEN, doScrollToScreen)
  yield takeEvery(actionTypes.SAVE_SCREEN, doScrollAfterScreenSaved)
  yield takeLatest(actionTypes.INITIALIZE, doInitialize)
  yield takeLatest(actionTypes.SAVE_USER_AGENT, doFillUserAgentInScreenDialog)
  yield takeLatest(actionTypes.INITIALIZED, doIframeCommunications)
  yield takeLatest(actionTypes.INITIALIZED, doBackgroundCommunications)
  yield takeLatest(actionTypes.APP_RESET, doAppReset)

  yield takeLatest(actionTypes.SEARCH_ELEMENT, doSearchElement)
  yield takeLatest(actionTypes.TOGGLE_INSPECT_BY_MOUSE, doInspectByMouse)
  yield takeLatest(actionTypes.APP_SAVED, doTurnOffInspectByMouse)
  yield takeLatest(actionTypes.EXPORT_APP, doExportApp)
  yield takeLatest(actionTypes.IMPORT_APP, doImportApp)
  yield takeLatest(actionTypes.REFRESH, doRefresh)

  yield fork(screenshot)
  yield doWatchAllAction()
}
