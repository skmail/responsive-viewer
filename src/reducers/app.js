import arrayMove from 'array-move'
import actionTypes from '../actions/actionTypes'
import devices from '../devices'
import userAgents from '../userAgent'
import { generateVersionedUrl } from '../utils/screen'

const initialState = {
  screens: devices,
  userAgents,
  url: '',
  versionedUrl: '',
  viewMode: 'vertical',
  zoom: 1,
  screenDirection: 'portrait',
  syncScroll: true,
  syncClick: true,
  initialized: false,
  tab: 'default',
  tabs: [
    {
      name: 'default',
      screens: [],
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

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INITIALIZED: {
      return {
        ...state,
        ...(action.payload.app ? action.payload.app : {}),
      }
    }
    case actionTypes.UPDATE_URL:
      return {
        ...state,
        url: action.payload.url,
        versionedUrl: generateVersionedUrl(action.payload.url),
        screens: state.screens.map(screen => ({
          ...screen,
          timestamp: Date.now(),
        })),
      }

    case actionTypes.SAVE_SCREEN:
      const foundScreen = state.screens.find(
        screen => screen.id === action.payload.screen.id
      )

      let screens = state.screens

      if (foundScreen) {
        screens = screens.map(screen => {
          if (screen.id === foundScreen.id) {
            return {
              ...screen,
              ...action.payload.screen,
              highlighted: false,
            }
          }
          return screen
        })
      } else {
        screens = [...screens, action.payload.screen]
      }
      return {
        ...state,
        screens,
      }

    case actionTypes.UPDATE_VISIBILITY:
      const screen = state.screens.find(
        screen => screen.id === action.payload.id
      )
      return {
        ...state,
        screens: [
          ...state.screens.filter(screen => screen.id !== action.payload.id),
          {
            ...screen,
            visible: action.payload.visibility,
          },
        ],
      }
    case actionTypes.SORT_SCREENS:
      return {
        ...state,
        screens: [
          ...action.payload.screens,
          ...state.screens.filter(screen => !screen.visible),
        ],
      }

    case actionTypes.ZOOM:
      return {
        ...state,
        zoom: action.payload.zoom,
      }

    case actionTypes.SWITCH_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload.viewMode,
      }
    case actionTypes.SWITCH_SCREEN_DIRECTION:
      return {
        ...state,
        screenDirection: action.payload.screenDirection,
      }

    case actionTypes.HIGHLIGHT_SCREEN:
      return {
        ...state,
        screens: state.screens.map(screen => {
          if (screen.id === action.payload.id) {
            return {
              ...screen,
              highlighted: true,
            }
          }
          return screen
        }),
      }

    case actionTypes.UNHIGHLIGHT_SCREEN:
      return {
        ...state,
        screens: state.screens.map(screen => {
          if (screen.id === action.payload.id) {
            return {
              ...screen,
              highlighted: false,
            }
          }
          return screen
        }),
      }

    case actionTypes.TOGGLE_TAB_SCREEN:
      return {
        ...state,
        tabs: state.tabs.map(tab => {
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
        }),
      }
    case actionTypes.SAVE_USER_AGENT: {
      return {
        ...state,
        userAgents: [...state.userAgents, action.payload.userAgent],
      }
    }

    case actionTypes.DELETE_SCREEN:
      return {
        ...state,
        screens: state.screens.filter(
          screen => screen.id !== action.payload.id
        ),
      }

    case actionTypes.APP_RESET: {
      return {
        ...initialState,
        url: state.url,
        versionedUrl: state.versionedUrl,
      }
    }

    case actionTypes.TOGGLE_SYNC_SCROLL: {
      return {
        ...state,
        syncScroll: !state.syncScroll,
      }
    }

    case actionTypes.TOGGLE_SYNC_CLICK: {
      return {
        ...state,
        syncClick: !state.syncClick,
      }
    }

    case actionTypes.IMPORT_APP: {
      return {
        ...state,
        ...action.payload.data,
      }
    }

    case actionTypes.SELECT_TAB_BY_INDEX:
      return {
        ...state,
        tab: state.tabs[action.payload.index].name,
      }

    case actionTypes.MOVE_TAB_SCREEN: {
      return {
        ...state,
        tabs: state.tabs.map(tab => {
          if (tab.name === action.payload.name) {
            return {
              ...tab,
              screens: arrayMove(
                tab.screens,
                action.payload.fromIndex,
                action.payload.toIndex
              ),
            }
          }
          return tab
        }),
      }
    }

    case actionTypes.UPDATE_TAB:
      return {
        ...state,
        tabs: state.tabs.map(tab => {
          if (tab.name === action.payload.name) {
            return {
              ...tab,
              ...action.payload.tab,
            }
          }
          return tab
        }),
      }

    case actionTypes.ADD_TAB:
      return {
        ...state,
        tabs: [
          ...state.tabs,
          {
            ...action.payload.tab,
            screens: [],
          },
        ],
      }
    case actionTypes.DELETE_TAB:
      return {
        ...state,
        tab: 'default',
        tabs: state.tabs.filter(tab => tab.name !== action.payload.tabName),
      }
    default:
      return state
  }
}
