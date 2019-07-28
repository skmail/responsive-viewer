import actionTypes from '../actions/actionTypes'

const initialState = {
  drawerOpened: true,
  screenDialog: {
    open: false,
    initialValues: {
      name: "",
      width: "",
      height: "",
      userAgent: "",
      visible: true
    }
  },
  userAgentDialog: {
    open: false,
    initialValues: {
      name: "",
      label: "",
    }
  },
  helpDialog:{
    open: false
  }
}

export default (state = initialState, action) => {

  switch (action.type) {

    case actionTypes.TOGGLE_DRAWER:
      return {
        ...state,
        drawerOpened: !state.drawerOpened
      }

    case actionTypes.TOGGLE_SCREEN_DIALOG: {
      return {
        ...state,
        screenDialog: {
          open: !state.screenDialog.open,
          initialValues: {
            ...initialState.screenDialog.initialValues,
            ...action.payload.initialValues,
          }
        }
      }
    }
    case actionTypes.TOGGLE_USER_AGENT_DIALOG: {
      return {
        ...state,
        userAgentDialog: {
          open: !state.userAgentDialog.open,
          initialValues: action.payload.initialValues
        }
      }
    }

    case actionTypes.TOGGLE_HELP_DIALOG:{
      return {
        ...state,
        helpDialog: {
          ...state.helpDialog,
          open: !state.helpDialog.open,
        }
      }
    }
    default:
      return state
  }

}