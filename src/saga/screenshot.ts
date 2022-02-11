import { call, put, select, take, takeLatest } from 'redux-saga/effects'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { extractHostname, slugify } from '../utils/url'
import { iframeChannel } from './utils/iframeChannel'
import { sendMessageToScreens } from './utils/sendMessageToScreens'
import { scrollToElement } from '../utils/scrollToElement'
import { getIframeId } from '../utils/screen'
import { buildScreenshotScrolls } from './utils/buildScreenshotScrolls'
import { screenCaptureRequest } from './utils/screenCaptureRequest'
import { Device, ScreenDirection, ScreenshotType } from '../types'
import {
  selectScreenDirection,
  selectScreensByIds,
  selectScreensByTab,
  selectSelectedTab,
  selectUrl,
  selectZoom,
} from '../reducers/app'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  addScreenshots,
  download,
  Screenshot,
  selectScreenshotsById,
  screenshot,
} from '../reducers/screenshots'
import uuid from 'uuid'
import { notify } from '../reducers/notifications'
import { imgSrcToBlob } from 'blob-util'

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
): unknown {
  const { type, screens: screenIds } = action.payload
  const screens: Device[] = yield select(state =>
    screenIds.length
      ? selectScreensByIds(state, screenIds)
      : selectScreensByTab(state, selectSelectedTab(state))
  )

  const url = yield select(selectUrl)
  const screenDirection = yield select(selectScreenDirection)

  const screenshots: Screenshot[] = []

  yield put(
    notify({
      message: 'Taking a screenshot please wait',
      type: 'info',
      loading: true,
      cancellable: false,
    })
  )

  for (let screen of screens) {
    const image: Blob = yield call(captureScreen, screen, {
      type,
    })

    screenshots.push({
      screenId: screen.id,
      image: URL.createObjectURL(image),
      filename: makeScreenshotFilename(screen, screenDirection),
    })
  }

  const id = uuid.v4()

  yield put(
    addScreenshots({
      id,
      screenshots,
      url,
    })
  )

  yield put(
    notify({
      type: 'success',
      message: 'Screnshots are ready',
      actions: [
        {
          label: 'Download',
          action: download(id),
        },
      ],
    })
  )
}

function* captureScreen(
  screen: Device,
  { type }: { type: ScreenshotType }
): unknown {
  const margin = 16

  const { screenDirection, zoom } = yield select(state => ({
    screenDirection: selectScreenDirection(state),
    zoom: selectZoom(state),
  }))

  const iframeElement: HTMLIFrameElement = yield call(
    { context: document, fn: document.getElementById },
    getIframeId(screen.id)
  )

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

  const parentBox = {
    x: parentBoundingBox.x + margin,
    y: parentBoundingBox.y + margin,
    width: parentBoundingBox.width - margin * 2,
    height: parentBoundingBox.height - margin * 2,
  }

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

    const image = yield screenCaptureRequest()

    if (image) {
      const iframeBox = iframeElement.getBoundingClientRect()

      let x = iframeBox.x < parentBox.x ? parentBox.x : iframeBox.x
      let y = iframeBox.y < parentBox.y ? parentBox.y : iframeBox.y

      if (scroll.height < parentBox.height) {
        y = iframeBox.bottom - scroll.height
      }

      if (scroll.width < parentBox.width) {
        x = iframeBox.right - scroll.width
      }

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

  const blob = yield new Promise(accept => {
    canvas.toBlob(accept, 'image/png', 1)
  })

  return blob
}

function* doDownload(action: PayloadAction<string>): unknown {
  const screenshots = yield select(state =>
    selectScreenshotsById(state, action.payload)
  )

  var zip = new JSZip()

  for (let screenshot of screenshots.screenshots) {
    const image = yield call(imgSrcToBlob, screenshot.image)

    zip.file(screenshot.filename, image)
  }

  const result = yield zip.generateAsync({ type: 'blob' })

  yield call(
    saveAs,
    result,
    slugify(`${extractHostname(screenshots.url)}-screenshots.zip`)
  )
}

export default function* rootSaga() {
  yield takeLatest(screenshot.toString(), doScreenshot)

  yield takeLatest(download.toString(), doDownload)
}
