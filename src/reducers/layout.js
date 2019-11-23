import actionTypes from '../actions/actionTypes'

const initialState = {
  initialized: false,
  drawerOpened: true,
  inspectByMouse: false,
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
        inspectByMouse: !state.inspectByMouse,
      }
    default:
      return state
  }
}
