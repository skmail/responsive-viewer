import platform from '../platform'

import {
  takeLatest,
  takeEvery,
  call,
  put,
  delay,
  take,
  select,
} from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import {
  scrollToScreen,
  highlightScreen,
  unHighlightScreen,
  initialize,
  initialized,
} from '../actions'
import scrollIntoView from 'scroll-into-view'
import { getDomId, getIframeId } from '../utils/screen'
import { waitFor } from '../utils/saga'
import { NAME as APP_NAME, SCREEN_DIALOG_FORM_NAME } from '../constants'
import { saveState, loadState, resetState } from '../utils/state'
import { change as changeForm } from 'redux-form'
import actionTypes from '../actions/actionTypes'

const doScrollToScreen = function*({ payload }) {
  const { id } = payload

  const iframeId = yield call(getDomId, id)

  const element = document.getElementById(iframeId)

  const scroll = () =>
    eventChannel(emitter => {
      scrollIntoView(
        element,
        {
          align: {
            top: 0.1,
            left: 0,
            topOffset: 25,
            leftOffset: 0,
          },
        },
        () => {
          emitter(END)
        }
      )

      return () => {}
    })

  const scrollChannel = yield call(scroll)

  try {
    while (true) {
      yield take(scrollChannel)
    }
  } finally {
    yield put(highlightScreen(id))

    yield delay(400)

    yield put(unHighlightScreen(id))
  }
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

  yield delay(100)

  yield put(scrollToScreen(id))
}

function* doSaveToState() {
  while (true) {
    const action = yield take('*')
    if (action.type.startsWith(APP_NAME)) {
      const state = yield select()
      yield call(saveState, state.app)

      yield call(platform.runtime.sendMessage, {
        message: 'LOAD_STATE',
        state: state.app,
      })
    }
  }
}

function* doInitialize() {
  const state = yield select()

  let app = yield call(loadState)

  app = app && typeof app === 'object' ? app : {}
  const screens = Array.isArray(app.screens) ? app.screens : state.app.screens
  app = {
    ...state.app,
    ...app,
    screens: screens.map(screen => ({
      ...screen,
      highlighted: false,
    })),
  }

  const initializeChannel = eventChannel(emitter => {
    try {
      platform.runtime.sendMessage({ message: 'GET_TAB_URL' }, function(
        response
      ) {
        console.log(response)
        emitter(response)
        emitter(END)
      })
    } catch (e) {}

    return () => {}
  })

  try {
    const response = yield take(initializeChannel)

    const { tabUrl } = response

    app = {
      ...state.app,
      ...app,
      url: tabUrl || app.url,
      versionedUrl: tabUrl || app.url,
    }
  } catch (err) {}

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

const sendMessageToScreens = (screens, message) => {
  screens = screens.filter(screen => screen.visible)
  let counter = 0
  while (counter < screens.length) {
    const screen = screens[counter]
    const iframeId = getIframeId(screen.id)
    const element = document.getElementById(iframeId)
    element.contentWindow.postMessage(message, '*')
    counter++
  }
}
function* doIframeCommunications() {
  const syncScrollChannel = eventChannel(emitter => {
    window.addEventListener('message', event => {
      if (!event.data || !String(event.data.message).startsWith('@APP/')) {
        return
      }
      emitter(event.data)
    })

    return () => {}
  })

  while (true) {
    const data = yield take(syncScrollChannel)

    const state = yield select()
    let allowedToSend = false

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
      default:
        allowedToSend = false
    }

    if (allowedToSend) {
      sendMessageToScreens(state.app.screens, data)
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

  sendMessageToScreens(state.app.screens, {
    message: '@APP/SCROLL_TO_ELEMENT',
    path: selector,
  })
}

function* doInspectByMouse() {
  const state = yield select()

  if (state.layout.inspectByMouse) {
    sendMessageToScreens(state.app.screens, {
      message: '@APP/ENABLE_MOUSE_INSPECTOR',
    })
  } else {
    sendMessageToScreens(state.app.screens, {
      message: '@APP/DISABLE_MOUSE_INSPECTOR',
    })
  }
}

export default function*() {
  yield takeEvery(actionTypes.SCROLL_TO_SCREEN, doScrollToScreen)
  yield takeEvery(actionTypes.SAVE_SCREEN, doScrollAfterScreenSaved)
  yield takeLatest(actionTypes.INITIALIZE, doInitialize)
  yield takeLatest(actionTypes.SAVE_USER_AGENT, doFillUserAgentInScreenDialog)
  yield takeLatest(actionTypes.INITIALIZED, doIframeCommunications)
  yield takeLatest(actionTypes.APP_RESET, doAppReset)

  yield takeLatest(actionTypes.SEARCH_ELEMENT, doSearchElement)
  yield takeLatest(actionTypes.TOGGLE_INSPECT_BY_MOUSE, doInspectByMouse)
  yield doSaveToState()
}
