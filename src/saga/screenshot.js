import { call, put, select, take, takeLatest } from 'redux-saga/effects'
import actionTypes from '../actions/actionTypes'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { extractHostname, slugify } from '../utils/url'
import { getScreensByTab, getSelectedTab } from '../selectors'
import { iframeChannel } from './utils/iframeChannel'
import { sendMessageToScreens } from './utils/sendMessageToScreens'
import { scrollToElement } from './utils/scrollToElement'
import { getDomId, getIframeId } from '../utils/screen'
import { screenshotDone, screenshotStarted } from '../actions'
import { buildScreenshotScrolls } from './utils/buildScreenshotScrolls'
import { screenCaptureRequest } from './utils/screenCaptureRequest'

const makeScreenshotFilename = (
  screen,
  screenDirection,
  prefix = undefined
) => {
  const screenWidth =
    screenDirection === 'landscape' ? screen.height : screen.width

  const screenHeight =
    screenDirection === 'landscape' ? screen.width : screen.height

  const name = [prefix, screen.name, `${screenWidth}x${screenHeight}`]
    .filter(Boolean)
    .join('-')

  return slugify(`${name}.png`)
}
function* doScreenshotAll(action) {
  const state = yield select()

  const { type } = action.payload
  const screens = getScreensByTab(state, getSelectedTab(state))

  var zip = new JSZip()

  for (let screen of screens) {
    const image = yield call(captureScreen, screen, {
      type,
      resetPosition: false,
    })

    zip.file(makeScreenshotFilename(screen, state.app.screenDirection), image)
  }

  const file = yield zip.generateAsync({ type: 'blob' })

  yield saveAs(
    file,
    slugify(`${extractHostname(state.app.url)}-screenshots.zip`)
  )
}

function* captureScreen(screen, { type, resetPosition = true }) {
  const state = yield select()
  const margin = 10
  const { screenDirection, zoom } = state.app

  const iframeElement = document.getElementById(getIframeId(screen.id))
  const screenElement = document.getElementById(getDomId(screen.id))

  yield scrollToElement(iframeElement, {
    topOffset: margin,
    leftOffset: margin,
  })

  yield call(
    sendMessageToScreens,
    [screen],
    {
      message: '@APP/DIMENSIONS',
      type,
    },
    50
  )

  const iframeResponse = yield take(iframeChannel('@APP/DIMENSIONS', true))

  const screenHeight =
    screenDirection === 'landscape' ? screen.width : screen.height
  const screenWidth =
    screenDirection === 'landscape' ? screen.height : screen.width
  const iframeHeight = type === 'full' ? iframeResponse.height : screenHeight
  const height = iframeHeight * zoom
  iframeElement.style.height = `${iframeHeight}px`
  const parent = document.getElementById('screens-wrapper')
  const parentBoundingBox = parent.getBoundingClientRect()
  const screenElementBoundingBox = screenElement.getBoundingClientRect()

  const parentBox = {
    x: parentBoundingBox.x + margin,
    y: parentBoundingBox.y + margin,
    width: parentBoundingBox.width - margin * 2,
    height: parentBoundingBox.height - margin * 2,
  }
  const oldScreenPosition = {
    y: screenElementBoundingBox.y - parentBox.y,
    x: screenElementBoundingBox.x - parentBox.x,
  }

  const canvas = document.createElement('canvas')
  canvas.width = screenWidth * zoom
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio)
  const scale = value => value * window.devicePixelRatio
  ctx.fillStyle = 'blue'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  yield put(
    screenshotStarted({
      width: parentBox.width,
      height: parentBox.height,
      x: parentBox.x,
      y: parentBox.y,
    })
  )
  const scrolls = buildScreenshotScrolls(
    {
      width: screenWidth * zoom,
      height,
    },
    parentBox
  )

  for (let scroll of scrolls) {
    yield scrollToElement(iframeElement, {
      leftOffset: (scroll.x - margin) * -1,
      topOffset: (scroll.y - margin) * -1,
    })

    console.log('started')

    const image = yield screenCaptureRequest()

    if (image) {
      const iframeBox = iframeElement.getBoundingClientRect()

      let x = iframeBox.x < parentBox.x ? parentBox.x : iframeBox.x
      let y = iframeBox.y < parentBox.y ? parentBox.y : iframeBox.y

      const initialY = y
      if (scroll.height < parentBox.height) {
        y = iframeBox.bottom - scroll.height
      }

      if (scroll.width < parentBox.width) {
        x = iframeBox.right - scroll.width
      }

      console.log({
        initialY,
        'parentBox.height': parentBox.height,
        'parentBox.y': parentBox.y,
        x,
        y,
        scroll,
      })
      ctx.drawImage(
        image,
        scale(x),
        scale(y),

        scale(scroll.width),
        scale(scroll.height),

        scale(scroll.x),
        scale(scroll.y),

        scale(scroll.width),
        scale(scroll.height)
      )
    }
  }

  iframeElement.style.height = `${screenHeight}px`
  // if (resetPosition) {
  //   yield scrollToElement(screenElement, {
  //     topOffset: oldScreenPosition.y,
  //     leftOffset: oldScreenPosition.x,
  //   })
  // }

  const blob = yield new Promise(accept => {
    canvas.toBlob(accept, 'image/png', 1)
  })

  console.log('END', screen.name)

  console.log('---------------')
  return blob
}

function* doScreenshot(action) {
  const { screen, type } = action.payload
  const state = yield select()

  const image = yield call(captureScreen, screen, {
    type,
  })

  if (image) {
    saveAs(
      image,
      makeScreenshotFilename(
        screen,
        state.app.screenDirection,
        extractHostname(state.app.url)
      )
    )
  }

  yield put(screenshotDone(screen))
}

export default function*() {
  yield takeLatest(actionTypes.SCREENSHOT, doScreenshot)
  yield takeLatest(actionTypes.SCREENSHOT_ALL, doScreenshotAll)
}
