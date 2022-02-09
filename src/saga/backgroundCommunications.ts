import { eventChannel } from 'redux-saga'
import { take, takeLatest } from 'redux-saga/effects'
import platform from '../platform'
import { initialized } from '../reducers/app'
function* doBackgroundCommunications() {
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
      yield take(waitForBackgroundMessages)
    }
  } catch (error) {
    console.error('unable to comunicate')
  }
}
export default function* rootSaga() {
  yield takeLatest(initialized.toString(), doBackgroundCommunications)
}
