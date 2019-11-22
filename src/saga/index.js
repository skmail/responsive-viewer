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
  saveScreen,
  initialize,
  initialized,
  saveUserAgent,
  appReset,
} from '../actions'
import scrollIntoView from 'scroll-into-view'
import { getDomId, getIframeId } from '../utils/screen'
import { waitFor } from '../utils/saga'
import { NAME as APP_NAME, SCREEN_DIALOG_FORM_NAME } from '../constants'
import { saveState, loadState, resetState } from '../utils/state'
import { change as changeForm } from 'redux-form'

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

      yield call(window.chrome.runtime.sendMessage, {
        message: 'LOAD_STATE',
        state: state.app,
      })
    }
  }
}

function* doInitialize() {
  let app = yield call(loadState)
  const state = yield select()
  if (app) {
    app = {
      ...state.app,
      ...app,
      screens: app.screens.map(screen => ({
        ...screen,
        highlighted: false,
      })),
    }

    yield call(window.chrome.runtime.sendMessage, {
      message: 'LOAD_STATE',
      state: app,
    })

    yield put(initialized({ app }))
  }

  const initializeEvent = () =>
    eventChannel(emitter => {
      try {
        window.chrome.runtime.sendMessage({ message: 'GET_TAB_URL' }, function(
          response
        ) {
          emitter(response)
          emitter(END)
        })
      } catch (e) {}
      return () => {}
    })

  const initializeChannel = yield call(initializeEvent)

  try {
    while (true) {
      const response = yield take(initializeChannel)

      const { tabUrl } = response

      if (app) {
        app = {
          ...state.app,
          ...app,
          screens: app.screens.map(screen => ({
            ...screen,
            highlighted: false,
          })),
          url: tabUrl || app.url,
          versionedUrl: tabUrl || app.url,
        }
      } else {
        app = {
          ...state.app,
          url: tabUrl ? tabUrl : '',
          versionedUrl: tabUrl ? tabUrl : '',
        }
      }

      yield call(window.chrome.runtime.sendMessage, {
        message: 'LOAD_STATE',
        state: app,
      })

      yield put(initialized({ app }))
    }
  } finally {
  }
}

function* doFillUserAgentInScreenDialog({ payload }) {
  const { userAgent } = payload

  yield put(changeForm(SCREEN_DIALOG_FORM_NAME, 'userAgent', userAgent.name))
}

function* doIframeCommunications() {
  const syncScrollChannel = eventChannel(emitter => {
    window.addEventListener('message', event => {
      if (!event.data || event.data.message !== 'FRAME_SCROLL') {
        return
      }
      emitter(event.data)
    })
  })

  while (true) {
    const data = yield take(syncScrollChannel)
    const state = yield select()

    if (state.app.syncScroll) {
      const screens = state.app.screens.filter(screen => screen.visible)

      let counter = 0
      while (counter < screens.length) {
        const screen = screens[counter]
        const iframeId = getIframeId(screen.id)
        const element = document.getElementById(iframeId)
        element.contentWindow.postMessage(data, '*')
        counter++
      }
    }
  }
}

function* doAppReset() {
  yield call(resetState)

  yield put(initialize())
}

export default function*() {
  yield takeEvery(scrollToScreen().type, doScrollToScreen)
  yield takeEvery(saveScreen().type, doScrollAfterScreenSaved)
  yield takeLatest(initialize().type, doInitialize)
  yield takeLatest(saveUserAgent().type, doFillUserAgentInScreenDialog)
  yield takeLatest(initialized().type, doIframeCommunications)
  yield takeLatest(appReset().type, doAppReset)
  yield doSaveToState()
}
