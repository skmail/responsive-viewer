import platform from '../platform'
import { call, put, select, take, takeLatest } from 'redux-saga/effects'
import {
  initialized,
  selectScreensByTab,
  selectSelectedTab,
  selectSyncClick,
  selectSyncScroll,
} from '../reducers/app'
import { screenConnected } from '../reducers/runtime'
import { RootState } from '../store'
import { Device } from '../types'
import { iframeChannel } from './utils/iframeChannel'
import { sendMessageToScreens } from './utils/sendMessageToScreens'

function* doIframeCommunications(): unknown {
  const channel = iframeChannel()

  while (true) {
    const data: any = yield take(channel)

    const screens: Device[] = yield select((state: RootState) =>
      selectScreensByTab(state, selectSelectedTab(state))
    )

    let allowedToSend = false

    yield put({
      type: `@IFRAME/${data.message}`,
    })

    switch (data.message) {
      case '@APP/READY':
        yield call(sendMessageToScreens, screens, {
          message: '@APP/WHO_ARE_YOU',
          fromFrameId: data.frameId,
        })

        break

      case '@APP/IDENTIFIED':
        yield put(
          screenConnected({
            screenId: data.screen.id,
            frameId: data.frameId,
          })
        )
        yield call(platform.runtime.sendMessage, {
          message: 'SCREEN_IDENTIFIED',
          screenId: data.screen.id,
          frameId: data.frameId,
        })
        break
      case '@APP/FRAME_SCROLL':
        allowedToSend = yield select(selectSyncScroll)
        break

      case '@APP/CLICK':
      case '@APP/DELEGATE_EVENT':
        allowedToSend = yield select(selectSyncClick)
        break

      case '@APP/FINISH_INSPECT_ELEMENT':
      case '@APP/CLEAR_INSPECT_ELEMENT':
      case '@APP/INSPECT_ELEMENT':
      case '@APP/REFRESH':
        allowedToSend = true
        break

      default:
        allowedToSend = false
    }

    if (allowedToSend) {
      yield call(sendMessageToScreens, screens, data)
    }
  }
}

export default function* rootSaga() {
  yield takeLatest(initialized.toString(), doIframeCommunications)
}
