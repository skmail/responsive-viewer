import arrayMove from 'array-move'
import devices from '../data/devices'
import userAgents from '../data/userAgents'
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  Device,
  ScreenDirection,
  ScreensTab,
  UserAgent,
  ViewMode,
} from '../types'

import { RootState } from '../store'

export interface State {
  screens: Device[]
  screenDirection: ScreenDirection
  userAgents: UserAgent[]
  url: string
  zoom: number
  viewMode: ViewMode
  syncScroll: boolean
  syncClick: boolean
  tab: string
  tabs: ScreensTab[]
}
const initialState: State = {
  screens: devices,
  userAgents,
  url: '',
  viewMode: ViewMode.vertical,
  zoom: 1,
  screenDirection: ScreenDirection.portrait,
  syncScroll: true,
  syncClick: true,
  tab: 'default',
  tabs: [
    {
      name: 'default',
      screens: [
        'ad6154e2-cebb-4e72-9adb-fdef4f7686ca',
        '02b0f88c-5d8f-4a28-b461-1d9fee1ecfba',
        // '46d80c57-3792-46d2-822d-3069414339bc',
        // '8ce37d37-0bd3-4dce-9440-0eafeb4f2450',
        // '1169e6f9-63d8-464a-96cb-127bc5f97119',
        // '390040ea-de20-4652-843e-6a6dafe0e900',
      ],
    },
    {
      name: 'mobile',
      screens: [],
    },
    {
      name: 'tablet',
      screens: [],
    },
    {
      name: 'desktop',
      screens: [],
    },
  ],
}

export const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initialize() {},
    initialized(state, action: PayloadAction<Partial<State>>) {
      return {
        ...state,
        ...action.payload,
      }
    },
    updateUrl(state, action: PayloadAction<string>) {
      state.url = action.payload
      state.screens = state.screens.map(screen => ({
        ...screen,
        timestamp: Date.now(),
      }))
    },

    saveScreen(state, action: PayloadAction<Device>) {
      const foundScreen = state.screens.find(
        screen => screen.id === action.payload.id
      )

      if (foundScreen) {
        state.screens = state.screens.map(screen => {
          if (screen.id === foundScreen.id) {
            return {
              ...screen,
              ...action.payload,
              highlighted: false,
            }
          }
          return screen
        })
      } else {
        state.screens.push(action.payload)
      }
    },

    sortScreens(
      state,
      action: PayloadAction<{ tab: string; from: number; to: number }>
    ) {
      state.tabs = state.tabs.map(tab => {
        if (tab.name === action.payload.tab) {
          return {
            ...tab,
            screens: arrayMove(
              tab.screens,
              action.payload.from,
              action.payload.to
            ),
          }
        }
        return tab
      })
    },
    updateZoom(state, action: PayloadAction<number>) {
      state.zoom = action.payload
    },
    switchViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload
    },
    switchScreenDirection(state, action: PayloadAction<ScreenDirection>) {
      state.screenDirection = action.payload
    },
    highlightScreen(state, action: PayloadAction<string>) {
      state.screens = state.screens.map(screen => {
        if (screen.id === action.payload) {
          return {
            ...screen,
            highlighted: true,
          }
        }
        return screen
      })
    },
    unhighlightScreen(state, action: PayloadAction<string>) {
      state.screens = state.screens.map(screen => {
        if (screen.id === action.payload) {
          return {
            ...screen,
            highlighted: false,
          }
        }
        return screen
      })
    },

    toggleTab(
      state,
      action: PayloadAction<{ tabId: string; screenId: string }>
    ) {
      state.tabs = state.tabs.map(tab => {
        if (tab.name === action.payload.tabId) {
          let screens = [...tab.screens]
          if (screens.includes(action.payload.screenId)) {
            screens = screens.filter(id => id !== action.payload.screenId)
          } else {
            screens = [...screens, action.payload.screenId]
          }
          return {
            ...tab,
            screens,
          }
        }
        return tab
      })
    },

    saveUserAgent(state, action: PayloadAction<UserAgent>) {
      state.userAgents.push(action.payload)
    },
    deleteScreen(state, action: PayloadAction<string>) {
      state.screens = state.screens.filter(
        screen => screen.id !== action.payload
      )
    },

    appReset(state) {
      return {
        ...initialState,
        url: state.url,
      }
    },
    toggleSyncScroll(state) {
      state.syncScroll = !state.syncScroll
    },
    toggleSyncClick(state) {
      state.syncClick = !state.syncClick
    },

    setTabByIndex(state, action: PayloadAction<number>) {
      state.tab = state.tabs[action.payload].name
    },

    updateTab(
      state,
      action: PayloadAction<{ name: string; tab: Partial<ScreensTab> }>
    ) {
      state.tabs = state.tabs.map(tab => {
        if (tab.name === action.payload.name) {
          return {
            ...tab,
            ...action.payload.tab,
          }
        }
        return tab
      })
      if (state.tab === action.payload.name && action.payload.tab.name) {
        state.tab = action.payload.tab.name
      }
    },
    addTab(state, action: PayloadAction<Pick<ScreensTab, 'name'>>) {
      state.tabs.push({
        screens: [],
        ...action.payload,
      })
    },
    deleteTab(state, action: PayloadAction<string>) {
      state.tabs = state.tabs.filter(tab => tab.name !== action.payload)
      if (state.tab === action.payload) {
        state.tab = 'default'
      }
    },

    toggleTabScreen(
      state,
      action: PayloadAction<{ tabId: string; screenId: string }>
    ) {
      state.tabs = state.tabs.map(tab => {
        if (tab.name === action.payload.tabId) {
          let screens = [...tab.screens]
          if (screens.includes(action.payload.screenId)) {
            screens = screens.filter(id => id !== action.payload.screenId)
          } else {
            screens = [...screens, action.payload.screenId]
          }
          return {
            ...tab,
            screens,
          }
        }
        return tab
      })
    },
  },
})

export const {
  initialize,
  initialized,
  updateUrl,
  toggleTabScreen,
  sortScreens,
  appReset,

  addTab,
  updateTab,
  deleteTab,

  saveScreen,
  deleteScreen,

  saveUserAgent,

  switchScreenDirection,
  switchViewMode,

  updateZoom,

  toggleSyncClick,
  toggleSyncScroll,

  setTabByIndex,
} = slice.actions

export const appSaved = createAction('app/saved')
export const saveApp = createAction('app/save')

export const exportApp = createAction('app/export')
export const importApp = createAction<File>('app/import')

export const selectApp = (state: RootState) => state.app
export const selectScreens = (state: RootState) => selectApp(state).screens

export const selectSelectedTab = (state: RootState) => selectApp(state).tab

export const selectSelectedTabIndex = (state: RootState) =>
  selectTabs(state).findIndex(tab => tab.name === selectSelectedTab(state))

export const selectTabByIndex = (state: RootState, index: number) =>
  selectTabs(state).find((tab, i) => i === index) as ScreensTab

export const selectTabs = (state: RootState) => selectApp(state).tabs

export const selectTab = (state: RootState, tabName: string) =>
  selectTabs(state).find(tab => tab.name === tabName)

export const selectScreensByTab = (state: RootState, tabName: string) => {
  const tab = selectTab(state, tabName)

  if (!tab) {
    return []
  }

  return selectApp(state).screens.filter(screen =>
    tab.screens.includes(screen.id)
  )
}

export const selectScreensByIds = (state: RootState, screenIds: string[]) =>
  selectApp(state).screens.filter(screen => screenIds.includes(screen.id))

export const selectScreenById = (state: RootState, screenId: string) =>
  selectApp(state).screens.find(screen => screen.id === screenId) as Device

export const selectSyncScroll = (state: RootState) => state.app.syncScroll
export const selectSyncClick = (state: RootState) => state.app.syncClick
export const selectZoom = (state: RootState) => selectApp(state).zoom

export const selectViewMode = (state: RootState) => selectApp(state).viewMode

export const selectScreenDirection = (state: RootState) =>
  selectApp(state).screenDirection

export const selectUrl = (state: RootState) => selectApp(state).url

export const selectUserAgents = (state: RootState) =>
  selectApp(state).userAgents

export default slice.reducer
