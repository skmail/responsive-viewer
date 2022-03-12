import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { FrameStatus } from '../types'

export type ScreenRuntime = {
  isLoading: boolean
  frameId?: number
  frameStatus: FrameStatus
}

export type State = {
  screens: Record<string, ScreenRuntime>
}

const initialState: State = {
  screens: {},
}
export const slice = createSlice({
  name: 'runtime',
  initialState,
  reducers: {
    screenConnected(
      state,
      action: PayloadAction<{
        frameId: number
        screenId: string
      }>
    ) {
      let screen = state.screens[action.payload.screenId] || {}
      state.screens[action.payload.screenId] = {
        ...screen,
        isLoading: true,
        frameId: action.payload.frameId,
        frameStatus: FrameStatus.CONNECTED,
      }
    },

    screenIsLoading(state, action: PayloadAction<string>) {
      let screen = state.screens[action.payload]
      state.screens[action.payload] = {
        ...screen,
        isLoading: true,
      }
    },

    replaceScreensRuntime(
      state,
      action: PayloadAction<Record<string, ScreenRuntime>>
    ) {
      state.screens = action.payload
    },

    screenIsLoaded(state, action: PayloadAction<string>) {
      state.screens[action.payload].isLoading = false
    },
  },
})

export const {
  screenConnected,
  screenIsLoading,
  screenIsLoaded,
  replaceScreensRuntime,
} = slice.actions

export const iframeLoaded = createAction<string>('runtime/iframeLoaded')
export const select = (state: RootState) => state.runtime

export const selectSreensRuntime = (state: RootState) => select(state).screens
export const selectIsScreenLoading = (state: RootState, screenId: string) => {
  const screen = select(state).screens[screenId]
  if (!screen) {
    return true
  }
  return screen.isLoading
}
export const selectRuntimeFrameStatus = (
  state: RootState,
  screenId: string
) => {
  const screen = selectSreensRuntime(state)[screenId]

  if (!screen) {
    return FrameStatus.IDLE
  }

  return screen.frameStatus
}
export default slice.reducer
