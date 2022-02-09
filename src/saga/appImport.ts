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

const validateConfig = (config: Partial<State>) => {
  if (!config.screens) {
    throw new Error('Invalid screens')
  }

  for (let screen of config.screens) {
    if (typeof screen.width !== 'number') {
      throw new Error('Invalid screens')
    }
    if (typeof screen.height !== 'number') {
      throw new Error('Invalid screens')
    }
    if (screen.userAgent && typeof screen.userAgent !== 'string') {
      throw new Error('Invalid screens')
    }
    if (typeof screen.id !== 'string') {
      throw new Error('Invalid screens')
    }
  }
  if (!config.userAgents) {
    throw new Error('Invalid screens')
  }

  for (let screen of config.userAgents) {
    if (typeof screen.name !== 'string') {
      throw new Error('Invalid userAgents')
    }
    if (typeof screen.value !== 'string') {
      throw new Error('Invalid userAgents')
    }
  }

  if (typeof config.zoom !== 'number') {
    config.zoom = 1
  }

  return config
}

const loadFile = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = event => {
      try {
        if (!event.target) {
          throw new Error('invalid file')
        }

        const result = event.target.result as string

        const data = validateConfig(JSON.parse(result))

        resolve(data)
      } catch (error) {
        reject()
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
