import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import platform from '../platform'
import {
  importApp,
  initialized,
  selectApp,
  State,
  saveApp,
} from '../reducers/app'
import { saveState } from '../utils/state'
import { validateAppState } from '../utils/validateAppState'

const loadFile = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = event => {
      try {
        if (!event.target) {
          throw new Error('invalid file')
        }

        const result = event.target.result as string

        const data = validateAppState(JSON.parse(result))

        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsText(file)
  })
}
function* doImportApp(action: PayloadAction<File>) {
  try {
    const data: State = yield call(loadFile, action.payload)

    const state: State = yield select(selectApp)

    const newState = {
      ...state,
      ...data,
    }
    yield call(saveState, newState)
    yield call(platform.runtime.sendMessage, {
      message: 'LOAD_STATE',
      state: newState,
    })
    yield put(initialized(newState))
    yield put(saveApp())
  } catch (error) {
    alert('Error in importing the settings')
  }
}

export default function* rootSaga() {
  yield takeLatest(importApp.toString(), doImportApp)
}
