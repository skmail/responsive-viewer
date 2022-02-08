import actionTypes from '../actions/actionTypes'

const initialState = {
  initialized: false,
  drawerOpened: true,
  inspectByMouse: false,
  isTakingScreenShot: false,
  screenshot: null,
  tabDialog: {
    open: false,
    initialValues: {},
  },
  screenDialog: {
    open: false,
    initialValues: {
      name: '',
      width: '',
      height: '',
      userAgent: '',
      visible: true,
    },
  },
  userAgentDialog: {
    open: false,
    initialValues: {
      name: '',
      label: '',
    },
  },
  helpDialog: {
    open: false,
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INITIALIZED:
      return {
        ...state,
        initialized: true,
      }
    case actionTypes.TOGGLE_DRAWER:
      return {
        ...state,
        drawerOpened: !state.drawerOpened,
      }

    case actionTypes.TOGGLE_SCREEN_DIALOG: {
      return {
        ...state,
        screenDialog: {
          open: !state.screenDialog.open,
          initialValues: {
            ...initialState.screenDialog.initialValues,
            ...action.payload.initialValues,
          },
        },
      }
    }
    case actionTypes.TOGGLE_USER_AGENT_DIALOG: {
      return {
        ...state,
        userAgentDialog: {
          open: !state.userAgentDialog.open,
          initialValues: action.payload.initialValues,
        },
      }
    }

    case actionTypes.TOGGLE_HELP_DIALOG: {
      return {
        ...state,
        helpDialog: {
          ...state.helpDialog,
          open: !state.helpDialog.open,
        },
      }
    }
    case actionTypes.TOGGLE_INSPECT_BY_MOUSE:
      return {
        ...state,
        inspectByMouse:
          typeof action.payload.state !== 'undefined'
            ? action.payload.state
            : !state.inspectByMouse,
      }

    case actionTypes.TOGGLE_TAB_DIALOG:
      return {
        ...state,
        tabDialog: {
          open: !state.tabDialog.open,
          initialValues: action.payload.tab
            ? action.payload.tab
            : initialState.tabDialog.initialValues,
        },
        // isTabDialogOpened: !state.isTabDialogOpened,
      }

    case actionTypes.SCREENSHOT:
      return {
        ...state,
        isTakingScreenShot: true,
      }

    case actionTypes.SCREENSHOT_STARTED:
      return {
        ...state,
        screenshot: action.payload,
      }

    case actionTypes.SCREENSHOT_DONE:
      return {
        ...state,
        isTakingScreenShot: false,
        // screenshot: null,
      }

    default:
      return state
  }
}
