import platform from '../platform'
import { call, put, select, take, takeLatest } from 'redux-saga/effects'
import {
  initialized,
  selectScreensByTab,
  selectSelectedTab,
  selectSyncClick,
  selectSyncScroll,
} from '../reducers/app'
import { RootState } from '../store'
import { Device } from '../types'
import { iframeChannel } from './utils/iframeChannel'
import { sendMessageToScreens } from './utils/sendMessageToScreens'
import { getPrefixedMessage } from '../utils/getPrefixedMessage'
import { screenIsLoaded } from '../reducers/runtime'

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
      case getPrefixedMessage('READY'):
        yield put(screenIsLoaded(data.screenId))
        break

      case getPrefixedMessage('FRAME_SCROLL'):
        allowedToSend = yield select(selectSyncScroll)
        break

      case getPrefixedMessage('CLICK'):
      case getPrefixedMessage('DELEGATE_EVENT'):
        allowedToSend = yield select(selectSyncClick)
        break

      case getPrefixedMessage('FINISH_INSPECT_ELEMENT'):
      case getPrefixedMessage('CLEAR_INSPECT_ELEMENT'):
      case getPrefixedMessage('INSPECT_ELEMENT'):
      case getPrefixedMessage('REFRESH'):
        allowedToSend = true
        break

      default:
        allowedToSend = false
    }

    if (allowedToSend) {
      yield call(sendMessageToScreens, screens, data, 0, true)
    }
  }
}

export default function* rootSaga() {
  yield takeLatest(initialized.toString(), doIframeCommunications)
}
