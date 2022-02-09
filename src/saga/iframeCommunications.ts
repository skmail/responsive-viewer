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

function* doIframeCommunications(): unknown {
  while (true) {
    const data: any = yield take(iframeChannel())

    const screens: Device[] = yield select((state: RootState) =>
      selectScreensByTab(state, selectSelectedTab(state))
    )

    let allowedToSend = false

    yield put({
      type: `@IFRAME/${data.message}`,
    })

    switch (data.message) {
      case '@APP/FRAME_SCROLL':
        allowedToSend = yield select(selectSyncScroll)
        break

      case '@APP/CLICK':
      case '@APP/DELEGATE_EVENT':
        allowedToSend = yield select(selectSyncClick)
        break

      case '@APP/SCROLL_TO_ELEMENT':
        allowedToSend = true
        break

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
