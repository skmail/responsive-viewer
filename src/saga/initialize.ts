import { call, put, select, takeLatest } from 'redux-saga/effects'
import platform from '../platform'
import { initialize, initialized, selectApp, State } from '../reducers/app'
import { getPrefixedMessage } from '../utils/getPrefixedMessage'

import { loadState } from '../utils/state'
import { validateAppState } from '../utils/validateAppState'
import qs from 'qs'
import * as validation from '../utils/validation'

const getUrlFromQueryString = (querystring: string, defaultValue?: string) => {
  if (querystring.startsWith('?')) {
    querystring = querystring.substring(1)
  }
  let url = qs.parse(querystring).url as string | undefined

  if (typeof url !== 'string') {
    url = defaultValue
  }

  if (!url || !validation.url(url)) {
    return
  }

  url = url.replace(/^(?!(?:f|ht)tps?:\/\/)/, 'https://')

  return url
}
function* doInitialize(): unknown {
  let loadedState: Partial<State>

  try {
    loadedState = yield call(loadState)
    loadedState = validateAppState(loadedState)
  } catch (error) {
    loadedState = {}
  }
  let state: State = {
    ...(yield select(selectApp)),
    ...loadedState,
  }

  const url =
    process.env.REACT_APP_PLATFORM === 'LOCAL'
      ? getUrlFromQueryString(window.location.search, '')
      : window.location.href

  yield call(platform.runtime.sendMessage, {
    message: getPrefixedMessage('LOAD_STATE'),
    state: state,
  })

  yield put(
    initialized({
      ...state,
      url: url || state.url,
    })
  )
}

export default function* rootSaga() {
  yield takeLatest(initialize.toString(), doInitialize)
}
