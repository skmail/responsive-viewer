import { call, put, select, take, takeLatest } from 'redux-saga/effects'
import { saveAs } from 'file-saver'
import JSZip, { OutputType } from 'jszip'
import { extractHostname, slugify } from '../utils/url'
import { iframeChannel } from './utils/iframeChannel'
import { sendMessageToScreens } from './utils/sendMessageToScreens'
import { scrollToElement } from './utils/scrollToElement'
import { getIframeId } from '../utils/screen'
import { buildScreenshotScrolls } from './utils/buildScreenshotScrolls'
import { screenCaptureRequest } from './utils/screenCaptureRequest'
import { screenshot, screenshotDone } from '../reducers/layout'
import { Device, ScreenDirection, ScreenshotType } from '../types'
import {
  selectScreenDirection,
  selectScreensByIds,
  selectUrl,
  selectZoom,
} from '../reducers/app'
import { PayloadAction } from '@reduxjs/toolkit'

const makeScreenshotFilename = (
  screen: Device,
  screenDirection: ScreenDirection,
  prefix?: string
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
function* doScreenshot(
  action: PayloadAction<{
    screens: string[]
    type: ScreenshotType
  }>
) {
  const { type, screens: screenIds } = action.payload

  const screens: Device[] = yield select(state =>
    selectScreensByIds(state, screenIds)
  )
  const { screenDirection, url } = yield select(state => ({
    screenDirection: selectScreenDirection(state),
    url: selectUrl(state),
  }))

  var zip = new JSZip()

  for (let screen of screens) {
    const image: Blob = yield call(captureScreen, screen, {
      type,
    })

    zip.file(makeScreenshotFilename(screen, screenDirection), image)
  }

  const file: OutputType = yield call(zip.generateAsync, { type: 'blob' })

  yield saveAs(file, slugify(`${extractHostname(url)}-screenshots.zip`))

  yield put(screenshotDone())
}

function* captureScreen(
  screen: Device,
  { type }: { type: ScreenshotType }
): unknown {
  const margin = 10

  const { screenDirection, zoom } = yield select(state => ({
    screenDirection: selectScreenDirection(state),
    zoom: selectZoom(state),
  }))

  const iframeElement: HTMLIFrameElement = yield call(
    { context: document, fn: document.getElementById },
    getIframeId(screen.id)
  )

  // const screenElement: HTMLDivElement = yield call(
  //   { context: document, fn: document.getElementById },
  //   getDomId(screen.id)
  // )

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

  const iframeResponse: any = yield take(
    yield call(iframeChannel, '@APP/DIMENSIONS', true)
  )

  const screenHeight =
    screenDirection === 'landscape' ? screen.width : screen.height
  const screenWidth =
    screenDirection === 'landscape' ? screen.height : screen.width
  const iframeHeight = type === 'full' ? iframeResponse.height : screenHeight
  const height = iframeHeight * zoom
  iframeElement.style.height = `${iframeHeight}px`

  const parent: HTMLDivElement = yield call(
    { context: document, fn: document.getElementById },
    'screens-wrapper'
  )

  const parentBoundingBox = parent.getBoundingClientRect()
  // const screenElementBoundingBox = screenElement.getBoundingClientRect()

  const parentBox = {
    x: parentBoundingBox.x + margin,
    y: parentBoundingBox.y + margin,
    width: parentBoundingBox.width - margin * 2,
    height: parentBoundingBox.height - margin * 2,
  }
  // const oldScreenPosition = {
  //   y: screenElementBoundingBox.y - parentBox.y,
  //   x: screenElementBoundingBox.x - parentBox.x,
  // }

  const canvas = document.createElement('canvas')
  canvas.width = screenWidth * zoom
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return null
  }
  ctx.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio)
  const scale = (value: number) => value * window.devicePixelRatio
  ctx.fillStyle = 'blue'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

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

export default function*() {
  yield takeLatest(screenshot.toString(), doScreenshot)
}
