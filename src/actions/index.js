import actionTypes from './actionTypes'

export const updateUrl = url => ({
  type: actionTypes.UPDATE_URL,
  payload: {
    url,
  },
})

export const saveScreen = screen => ({
  type: actionTypes.SAVE_SCREEN,
  payload: {
    screen,
  },
})

export const updateVisibility = (id, visibility) => ({
  type: actionTypes.UPDATE_VISIBILITY,
  payload: {
    id,
    visibility,
  },
})

export const sortScreens = screens => ({
  type: actionTypes.SORT_SCREENS,
  payload: {
    screens,
  },
})

export const zoom = zoom => ({
  type: actionTypes.ZOOM,
  payload: {
    zoom,
  },
})

export const switchViewMode = viewMode => ({
  type: actionTypes.SWITCH_VIEW_MODE,
  payload: {
    viewMode,
  },
})

export const scrollToScreen = id => ({
  type: actionTypes.SCROLL_TO_SCREEN,
  payload: {
    id,
  },
})

export const highlightScreen = id => ({
  type: actionTypes.HIGHLIGHT_SCREEN,
  payload: {
    id,
  },
})

export const unHighlightScreen = id => ({
  type: actionTypes.UNHIGHLIGHT_SCREEN,
  payload: {
    id,
  },
})

export const toggleDrawer = () => ({
  type: actionTypes.TOGGLE_DRAWER,
})

export const switchScreenDirection = screenDirection => ({
  type: actionTypes.SWITCH_SCREEN_DIRECTION,
  payload: {
    screenDirection,
  },
})

export const initialize = () => ({
  type: actionTypes.INITIALIZE,
})

export const initialized = (payload = {}) => ({
  type: actionTypes.INITIALIZED,
  payload,
})

export const toggleScreenDialog = (initialValues = {}) => ({
  type: actionTypes.TOGGLE_SCREEN_DIALOG,
  payload: {
    initialValues,
  },
})

export const toggleUserAgentDialog = (initialValues = {}) => ({
  type: actionTypes.TOGGLE_USER_AGENT_DIALOG,
  payload: {
    initialValues,
  },
})

export const saveUserAgent = (userAgent = {}) => ({
  type: actionTypes.SAVE_USER_AGENT,
  payload: {
    userAgent,
  },
})

export const toggleHelpDialog = () => ({
  type: actionTypes.TOGGLE_HELP_DIALOG,
})

export const deleteScreen = id => ({
  type: actionTypes.DELETE_SCREEN,
  payload: {
    id,
  },
})

export const appReset = () => ({
  type: actionTypes.APP_RESET,
})

export const toggleSyncScroll = () => ({
  type: actionTypes.TOGGLE_SYNC_SCROLL,
})

export const toggleSyncClick = () => ({
  type: actionTypes.TOGGLE_SYNC_CLICK,
})

export const searchElement = selector => ({
  type: actionTypes.SEARCH_ELEMENT,
  payload: {
    selector,
  },
})

export const toggleInspectByMouse = () => ({
  type: actionTypes.TOGGLE_INSPECT_BY_MOUSE,
})
