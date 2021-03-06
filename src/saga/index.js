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
  appSaved,
  toggleInspectByMouse,
} from '../actions'
import scrollIntoView from 'scroll-into-view'
import { getDomId, getIframeId } from '../utils/screen'
import { waitFor } from '../utils/saga'
import { NAME as APP_NAME, SCREEN_DIALOG_FORM_NAME } from '../constants'
import { saveState, loadState, resetState } from '../utils/state'
import { change as changeForm } from 'redux-form'
import actionTypes from '../actions/actionTypes'
import { extractHostname, slugify } from '../utils/url'

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
            top: 0,
            left: 0,
            topOffset: 0,
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

      yield put(appSaved(state.app))
    }
  }
}

function* doInitialize() {
  const state = yield select()

  let app = yield call(loadState)

  app = app && typeof app === 'object' ? app : {}

  const screens = Array.isArray(app.screens) ? app.screens : state.app.screens

  const tabUrl = window.location.href

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

const sendMessageToScreens = (screens, message) => {
  screens = screens.filter(screen => screen.visible)
  let counter = 0

  while (counter < screens.length) {
    const screen = screens[counter]
    const iframeId = getIframeId(screen.id)
    const element = document.getElementById(iframeId)

    element.contentWindow.postMessage(
      {
        screen,
        ...message,
      },
      '*'
    )
    counter++
  }
}

function* doIframeCommunications() {
  const waitIframeMessage = eventChannel(emitter => {
    window.addEventListener('message', event => {
      if (!event.data || !String(event.data.message).startsWith('@APP/')) {
        return
      }
      emitter(event.data)
    })

    return () => {}
  })

  while (true) {
    const data = yield take(waitIframeMessage)

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

      case '@APP/DELEGATE_EVENT':
        allowedToSend = state.app.syncClick
        break

      case '@APP/SCREENSHOT':
        allowedToSend = false

        yield call(captureScreen, {
          type: 'CAPTURE_SCREEN',
          payload: {
            ...data,
          },
        })
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

function* doTurnOffInspectByMouse() {
  yield put(toggleInspectByMouse(false))
}

function doScreenshot(action) {
  const { payload } = action
  const { screen, type } = payload

  sendMessageToScreens([screen], {
    message: '@APP/SCREENSHOT',
    type,
  })
}

function* captureScreen(action) {
  console.log('request capture image')
  const state = yield select()

  const { payload } = action

  const { screen, height: fullIframeHeight, type } = payload

  const screenHeight =
    state.app.screenDirection === 'landscape' ? screen.width : screen.height
  const screenWidth =
    state.app.screenDirection === 'landscape' ? screen.height : screen.width

  const iframeHeight = type === 'full' ? fullIframeHeight : screenHeight

  const height = iframeHeight + iframeHeight * (state.app.zoom - 1)

  const iframeElement = document.getElementById(getIframeId(screen.id))

  iframeElement.style.height = `${iframeHeight}px`

  const screenElement = document.getElementById(getDomId(screen.id))

  const parent = document.getElementById('screens').parentElement

  const parentBoundingBox = parent.getBoundingClientRect()
  const screenElementBoundingBox = screenElement.getBoundingClientRect()

  const parentBox = {
    x: parentBoundingBox.x,
    y: parentBoundingBox.y,
    width: parentBoundingBox.width,
    height: parentBoundingBox.height,
  }

  const oldScreenPosition = {
    y: screenElementBoundingBox.y - parentBox.y,
    x: screenElementBoundingBox.x - parentBox.x,
  }

  const parentHeight = window.innerHeight - parentBox.y

  const canvas = document.createElement('canvas')

  canvas.width = screenWidth + screenWidth * (state.app.zoom - 1)

  canvas.height = height

  const ctx = canvas.getContext('2d')

  ctx.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio)

  const scale = value => value * window.devicePixelRatio

  ctx.fillStyle = 'blue'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const download = (uri, name) => {
    const link = document.createElement('a')
    link.innerText = 'Download'
    document.body.appendChild(link)
    link.download = `${name}.png`
    link.href = URL.createObjectURL(uri)
    link.click()
    document.body.removeChild(link)
  }

  const scrollChannel = scrolls =>
    new Promise(accept => {
      scrollIntoView(
        iframeElement,
        {
          align: {
            top: 0,
            left: 0,
            topOffset: -parentHeight * scrolls,
            leftOffset: 0,
          },
          time: 0,
        },
        () => {
          accept()
        }
      )
    })

  const captureChannel = () =>
    new Promise(accept => {
      platform.runtime.sendMessage({ message: 'CAPTURE_SCREEN' }, function(
        response
      ) {
        if (!response.image) {
          accept(false)
          return
        }

        const image = new Image()
        image.onload = function() {
          console.log('loaded', response.image)
          accept(image)
        }
        image.onerror = function() {
          accept(false)
          console.log('unable to load')
        }

        image.src = response.image
      })
    })

  const scrollsArray = String(height / parentHeight).split('.')

  let scrollTimes = (() => {
    if (scrollsArray[0] === '0') {
      return [0]
    }
    const array = []
    for (let i = 0; i < scrollsArray[0]; i++) {
      array.push(i)
    }

    if (scrollsArray.length === 2) {
      array.push(parseFloat(`${array[array.length - 1]}.${scrollsArray[1]}`))
    }

    return array
  })()

  let scrolls = 0

  while (scrolls < scrollTimes.length) {
    yield call(scrollChannel, scrollTimes[scrolls])

    yield delay(1000)

    const image = yield call(captureChannel)

    if (image) {
      const iframeBox = iframeElement.getBoundingClientRect()

      ctx.drawImage(
        image,
        scale(iframeBox.x),
        scale(parentBox.y),
        image.width,
        image.height,
        0,
        scale(parentHeight * scrollTimes[scrolls]),
        image.width,
        image.height
      )
    }

    yield delay(500)
    scrolls++
  }

  iframeElement.style.height = `${screenHeight}px`

  scrollIntoView(screenElement, {
    align: {
      top: 0,
      left: 0,
      topOffset: oldScreenPosition.y,
      leftOffset: oldScreenPosition.x,
    },
  })

  canvas.toBlob(blob => {
    download(
      blob,
      slugify(
        `${extractHostname(state.app.url)}-${
          screen.name
        }-${screenWidth}x${screenHeight}`
      )
    )
  })

  sendMessageToScreens([screen], {
    message: '@APP/SCREENSHOT_DONE',
  })
}

function* doBackgroundCommunications() {
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

  console.log('waiting for messages starts ..')
  while (true) {
    const data = yield take(waitForBackgroundMessages)

    console.log('data message', data)
  }
}

export default function*() {
  yield takeEvery(actionTypes.SCROLL_TO_SCREEN, doScrollToScreen)
  yield takeEvery(actionTypes.SAVE_SCREEN, doScrollAfterScreenSaved)
  yield takeLatest(actionTypes.INITIALIZE, doInitialize)
  yield takeLatest(actionTypes.SAVE_USER_AGENT, doFillUserAgentInScreenDialog)
  yield takeLatest(actionTypes.INITIALIZED, doIframeCommunications)
  yield takeLatest(actionTypes.INITIALIZED, doBackgroundCommunications)
  yield takeLatest(actionTypes.APP_RESET, doAppReset)

  yield takeLatest(actionTypes.SCREENSHOT, doScreenshot)

  yield takeLatest(actionTypes.SEARCH_ELEMENT, doSearchElement)
  yield takeLatest(actionTypes.TOGGLE_INSPECT_BY_MOUSE, doInspectByMouse)
  yield takeLatest(actionTypes.APP_SAVED, doTurnOffInspectByMouse)
  yield doSaveToState()
}
