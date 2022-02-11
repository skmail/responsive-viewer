import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { ScreenshotType } from '../types'

export type Screenshot = {
  screenId: string
  filename: string
  image: string
}

type ScreenshotsAction = {
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
        type: ScreenshotType
      }>
    ) {
      state.latest = {
        screens: action.payload.screens,
        type: action.payload.type,
        isRunning: true,
      }
    },
  },
})

export const { addScreenshots, download, screenshot } = slice.actions

export const select = (state: RootState) => state.screenshots

export const selectScreenshotsById = (state: RootState, id: string) =>
  select(state).screenshots.find(screenshots => screenshots.id === id)

export const selectIsTakingScreenshots = (state: RootState) =>
  select(state).latest.isRunning

export default slice.reducer
