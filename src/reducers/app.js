import actionTypes from '../actions/actionTypes'
import devices from '../devices'
import userAgents from '../userAgent'
import {generateVersionedUrl} from '../utils/screen'

const initialState = {
  screens: devices,
  userAgents,
  url: "",
  versionedUrl: "",
  viewMode: "vertical",
  zoom: 1,
  screenDirection: 'portrait',
}

export default (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.INITIALIZED: {
      return {
        ...state,
        ...(action.payload.app ? action.payload.app : {})
      }
    }
    case actionTypes.UPDATE_URL:
      return {
        ...state,
        url: action.payload.url,
        versionedUrl: generateVersionedUrl(action.payload.url)
      }

    case actionTypes.SAVE_SCREEN:
      const foundScreen = state.screens.find(screen => screen.id === action.payload.screen.id)
      let screens = state.screens

      if (foundScreen) {
        screens = screens.map(screen => {
          if (screen.id === foundScreen.id) {
            return {
              ...screen,
              ...action.payload.screen,
              highlighted: false
            }
          }
          return screen
        })
      } else {
        screens = [
          ...screens,
          action.payload.screen
        ]
      }
      return {
        ...state,
        screens
      }

    case actionTypes.UPDATE_VISIBILITY:
      const screen = state.screens.find(screen => screen.id === action.payload.id)
      return {
        ...state,
        screens: [
          ...state.screens.filter(screen => screen.id !== action.payload.id),
          {
            ...screen,
            visible: action.payload.visibility
          }
        ]
      }
    case actionTypes.SORT_SCREENS:
      return {
        ...state,
        screens: [
          ...action.payload.screens,
          ...state.screens.filter(screen => !screen.visible)
        ]
      }

    case actionTypes.ZOOM:
      return {
        ...state,
        zoom: action.payload.zoom
      }

    case actionTypes.SWITCH_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload.viewMode
      }
    case actionTypes.SWITCH_SCREEN_DIRECTION:
      return {
        ...state,
        screenDirection: action.payload.screenDirection
      }

    case actionTypes.HIGHLIGHT_SCREEN:
      return {
        ...state,
        screens: state.screens.map(screen => {
          if (screen.id === action.payload.id) {
            return {
              ...screen,
              highlighted: true
            }
          }
          return screen
        })
      }

    case actionTypes.UNHIGHLIGHT_SCREEN:
      return {
        ...state,
        screens: state.screens.map(screen => {
          if (screen.id === action.payload.id) {
            return {
              ...screen,
              highlighted: false
            }
          }
          return screen
        })
      }

    case actionTypes.SAVE_USER_AGENT: {
      // const foundUserAgent = state.userAgents.find(userAgent => userAgent.name === action.payload.userAgent.name)

      return {
        ...state,
        userAgents: [
          ...state.userAgents,
          action.payload.userAgent
        ]
      }
    }

    case actionTypes.DELETE_SCREEN:
      return {
        ...state,
        screens: state.screens.filter(screen => screen.id !== action.payload.id)
      }

    case actionTypes.APP_RESET: {
      return {
        ...initialState,
        url: state.url,
        versionedUrl: state.versionedUrl,
      }
    }
    default:
      return state
  }
}