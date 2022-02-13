import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export type ScreenRuntime = {
  isLoading: boolean
  frameId?: string
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
        frameId: string
        screenId: string
      }>
    ) {
      let screen = state.screens[action.payload.screenId]

      state.screens[action.payload.screenId] = {
        ...screen,
        isLoading: false,
        frameId: action.payload.frameId,
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
  },
})

export const {
  screenConnected,
  screenIsLoading,
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

export default slice.reducer
