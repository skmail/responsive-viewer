import { eventChannel } from 'redux-saga'
import { select, take, call, fork, takeLatest, put } from 'redux-saga/effects'
import { selectScreensByTab, selectSelectedTab } from '../reducers/app'
import { refresh } from '../reducers/layout'
import { onRefresh as onRefresh_ } from '../utils/onRefresh'
import { sendMessageToScreens } from './utils/sendMessageToScreens'

function* onRefresh(): unknown {
  const channel = yield eventChannel(emitter => {
    const cleanOnRefresh = onRefresh_(() => emitter(true))

    return () => {
      cleanOnRefresh()
    }
  })

  try {
    while (true) {
      yield take(channel)

      yield put(refresh())
    }
  } finally {
  }
}

function* doOnRefresh(): unknown {
  const screens = yield select(state =>
    selectScreensByTab(state, selectSelectedTab(state))
  )

  yield call(sendMessageToScreens, screens, {
    message: 'REFRESH',
  })
}
export default function* rootSaga() {
  yield fork(onRefresh)
  yield takeLatest(refresh.toString(), doOnRefresh)
}
