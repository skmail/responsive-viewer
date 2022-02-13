import { call, put, select, take, takeLatest, delay } from 'redux-saga/effects'
import { extractHostname, slugify } from '../utils/url'
import { iframeChannel } from './utils/iframeChannel'
import { sendMessageToScreens } from './utils/sendMessageToScreens'
import { scrollToElement } from '../utils/scrollToElement'
import { getIframeId } from '../utils/screen'
import { buildScreenshotScrolls } from './utils/buildScreenshotScrolls'
import { screenCaptureRequest } from './utils/screenCaptureRequest'
import { Device, ScreenDirection, ScreenshotType } from '../types'
import { Page, Element, ImageElement } from '../types/draw'
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
  editScreenshots,
  ScreenshotsAction,
} from '../reducers/screenshots'
import uuid from 'uuid'
import { notify, removeNotification } from '../reducers/notifications'
import { getPrefixedMessage } from '../utils/getPrefixedMessage'
import { saveAs } from '../utils/saveAs'
import { openDraw, setDrawData } from '../reducers/draw'
import { toZip } from '../utils/toZip'

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
    const {
      blob,
      width,
      height,
    }: { blob: Blob; width: number; height: number } = yield call(
      captureScreen,
      screen,
      {
        type,
      }
    )
    screenshots.push({
      screenId: screen.id,
      url: URL.createObjectURL(blob),
      filename: makeScreenshotFilename(screen, screenDirection),
      width,
      height,
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
          label: 'Edit',
          action: editScreenshots(id),
        },
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
      message: 'DIMENSIONS',
      type,
    },
    50
  )

  const iframeResponse: any = yield take(
    yield call(iframeChannel, getPrefixedMessage('DIMENSIONS'), true)
  )

  const screenHeight =
    screenDirection === 'landscape' ? screen.width : screen.height
  const screenWidth =
    screenDirection === 'landscape' ? screen.height : screen.width

  const height = (type === 'full' ? iframeResponse.height : screenHeight) * zoom

  iframeElement.style.height = `${height}px`

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

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
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
    yield delay(500)
  }

  iframeElement.style.height = ''

  const blob = yield new Promise(accept => {
    canvas.toBlob(accept, 'image/png', 1)
  })

  return {
    blob,
    width: canvas.width,
    height: canvas.height,
  }
}

function* doDownload(action: PayloadAction<string>): unknown {
  const screenshots = yield select(state =>
    selectScreenshotsById(state, action.payload)
  )

  const result = yield call(toZip, screenshots)

  saveAs(result, slugify(`${extractHostname(screenshots.url)}-screenshots.zip`))
}

function* doEditScreenshots(action: PayloadAction<string>): unknown {
  const screenshots: ScreenshotsAction = yield select(state =>
    selectScreenshotsById(state, action.payload)
  )

  const drawData = {
    pageIds: [] as string[],
    pages: {} as Record<string, Page>,
    elements: {} as Record<string, Element>,
  }

  for (let screenshot of screenshots.screenshots) {
    drawData.pageIds.push(screenshot.screenId)
    drawData.pages[screenshot.screenId] = {
      name: screenshot.filename,
      id: screenshot.screenId,
      elements: [screenshot.screenId],
      width: screenshot.width,
      height: screenshot.height,
    }

    drawData.elements[screenshot.screenId] = {
      type: 'image',
      id: screenshot.screenId,
      width: screenshot.width,
      height: screenshot.height,
      src: screenshot.url,
      x: 0,
      y: 0,
      draggable: false,
      locked: true,
    } as ImageElement
  }

  yield put(setDrawData(drawData))

  yield put(openDraw())

  yield put(removeNotification())
}

export default function* rootSaga() {
  yield takeLatest(screenshot.toString(), doScreenshot)

  yield takeLatest(download.toString(), doDownload)

  yield takeLatest(editScreenshots.toString(), doEditScreenshots)
}
