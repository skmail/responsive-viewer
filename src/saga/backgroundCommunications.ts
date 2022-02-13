import { eventChannel } from 'redux-saga'
import { put, take, takeLatest } from 'redux-saga/effects'
import platform from '../platform'
import { initialized } from '../reducers/app'
import { screenIsLoading } from '../reducers/runtime'
import { getPrefixedMessage } from '../utils/getPrefixedMessage'
function* doBackgroundCommunications(): unknown {
  try {
    const waitForBackgroundMessages = eventChannel(emitter => {
      platform.runtime.onMessage.addListener(function(
        message: any,
        sender: any,
        sendResponse: (data: any) => void
      ) {
        sendResponse({})

        emitter(message)

        return true
      })

      return () => {}
    })

    while (true) {
      const message = yield take(waitForBackgroundMessages)
      if (!message) {
        continue
      }
      switch (message.message) {
        case getPrefixedMessage('FRAME_REFRESHED'):
          yield put(screenIsLoading(message.screenId))
          break
      }
    }
  } catch (error) {
    console.error('unable to comunicate')
  }
}
export default function* rootSaga() {
  yield takeLatest(initialized.toString(), doBackgroundCommunications)
}
