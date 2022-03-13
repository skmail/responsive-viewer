import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { ScreenshotType } from '../types'

export type Screenshot = {
  screenId: string
  filename: string
  url: string
  width: number
  height: number
}

export type ScreenshotsAction = {
  id: string
  url: string
  screenshots: Screenshot[]
}

export type State = {
  screenshots: ScreenshotsAction[]
  isDownloading: boolean
  latest: {
    screens: string[]
    isRunning: boolean
    type: ScreenshotType
  }
}

const initialState: State = {
  screenshots: [],
  isDownloading: false,
  latest: {
    screens: [],
    isRunning: false,
    type: ScreenshotType.partial,
  },
}

export const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addScreenshots: (state, action: PayloadAction<ScreenshotsAction>) => {
      state.screenshots.push(action.payload)
      state.latest = {
        screens: [],
        isRunning: false,
        type: ScreenshotType.partial,
      }
    },
    download(state, action: PayloadAction<string>) {
      state.isDownloading = true
    },
    screenshot(
      state,
      action: PayloadAction<{
        screens: string[]
        type?: ScreenshotType
        cancel?: boolean
      }>
    ) {
      state.latest = {
        screens: action.payload.screens,
        type: action.payload.type || ScreenshotType.partial,
        isRunning: true,
      }
    },
    stopped(state) {
      state.latest.isRunning = false
    },
  },
})

export const { addScreenshots, download, screenshot, stopped } = slice.actions
export const editScreenshots = createAction<string>('screenshots/edit')

export const select = (state: RootState) => state.screenshots

export const selectScreenshotsById = (state: RootState, id: string) =>
  select(state).screenshots.find(screenshots => screenshots.id === id)

export const selectIsTakingScreenshots = (state: RootState) =>
  select(state).latest.isRunning

export default slice.reducer
