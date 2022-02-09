import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Device, ScreenshotType, ScreensTab, UserAgent } from '../types'
import { initialized } from './app'

export type State = {
  initialized: boolean
  drawerOpened: boolean
  inspectByMouse: boolean
  screenshot: {
    screens: string[]
    isRunning: boolean
    type: ScreenshotType
  }
  tabDialog: {
    open: boolean
    values: Pick<ScreensTab, 'name'>
  }
  screenDialog: {
    open: boolean
    values: Device
  }
  userAgentDialog: {
    open: boolean
    values: UserAgent
  }
  helpDialog: {
    open: boolean
  }
  highlightedScreen: string
}
const initialState: State = {
  initialized: false,
  drawerOpened: true,
  inspectByMouse: false,
  screenshot: {
    screens: [],
    isRunning: false,
    type: ScreenshotType.partial,
  },

  highlightedScreen: '',
  tabDialog: {
    open: false,
    values: {
      name: '',
    },
  },
  screenDialog: {
    open: false,
    values: {
      id: '',
      name: '',
      width: 375,
      height: 812,
      userAgent: '',
      visible: true,
    },
  },
  userAgentDialog: {
    open: false,
    values: {
      name: '',
      value: '',
    },
  },
  helpDialog: {
    open: false,
  },
}
export const slice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleMouseInspect(state, action: PayloadAction<boolean | undefined>) {
      state.inspectByMouse =
        action.payload === undefined ? !state.inspectByMouse : action.payload
    },
    screenshot(
      state,
      action: PayloadAction<{
        screens: string[]
        type: ScreenshotType
      }>
    ) {
      state.screenshot = {
        screens: action.payload.screens,
        type: action.payload.type,
        isRunning: true,
      }
    },
    screenshotDone(state) {
      state.screenshot = {
        screens: [],
        isRunning: false,
        type: ScreenshotType.partial,
      }
    },
    highlightScreen(state, action: PayloadAction<string>) {
      state.highlightedScreen = action.payload
    },
    dehighlightScreen(state) {
      state.highlightedScreen = initialState.highlightedScreen
    },

    toggleTabDialog(
      state,
      action: PayloadAction<{ name: string } | undefined>
    ) {
      if (state.tabDialog.open) {
        state.tabDialog = initialState.tabDialog
      } else {
        state.tabDialog = {
          open: true,
          values: action.payload || state.tabDialog.values,
        }
      }
    },

    toggleUserAgentDialog(state) {
      if (state.userAgentDialog.open) {
        state.userAgentDialog = initialState.userAgentDialog
      } else {
        state.userAgentDialog = {
          open: true,
          values: initialState.userAgentDialog.values,
        }
      }
    },

    updateScreenDialogValues(state, action: PayloadAction<Partial<Device>>) {
      state.screenDialog = {
        ...state.screenDialog,
        values: {
          ...state.screenDialog.values,
          ...action.payload,
        },
      }
    },

    toggleScreenDialog(state, action: PayloadAction<Device | undefined>) {
      if (state.screenDialog.open) {
        state.screenDialog = initialState.screenDialog
      } else {
        state.screenDialog = {
          open: true,
          values: action.payload || state.screenDialog.values,
        }
      }
    },

    toggleHelpDialog(state) {
      if (state.helpDialog.open) {
        state.helpDialog = initialState.helpDialog
      } else {
        state.helpDialog = {
          ...state.helpDialog,
          open: true,
        }
      }
    },
  },
  extraReducers: {
    [initialized.toString()]: state => {
      state.initialized = true
    },
  },
})

export const {
  toggleMouseInspect,
  screenshot,
  screenshotDone,
  highlightScreen,
  dehighlightScreen,

  toggleTabDialog,
  toggleUserAgentDialog,

  toggleScreenDialog,
  updateScreenDialogValues,

  toggleHelpDialog,
} = slice.actions

export const scrollToScreen = createAction<string>('layout/scrollToScreen')
export const searchElement = createAction<string>('layout/searchElement')

export const selectLayout = (state: RootState) => state.layout

export const selectMouseInspect = (state: RootState) =>
  selectLayout(state).inspectByMouse

export const selectHighlightedScreen = (state: RootState) =>
  selectLayout(state).highlightedScreen

export const selectIsAppReady = (state: RootState) =>
  selectLayout(state).initialized

export const selectTabDialog = (state: RootState) =>
  selectLayout(state).tabDialog

export const selectScreenDialog = (state: RootState) =>
  selectLayout(state).screenDialog

export const selectUserAgentDialog = (state: RootState) =>
  selectLayout(state).userAgentDialog

export const selectHelpDialog = (state: RootState) =>
  selectLayout(state).helpDialog

export default slice.reducer
