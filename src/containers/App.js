import { connect } from 'react-redux'
import App from '../components/App'
import {
  updateUrl,
  saveScreen,
  updateVisibility,
  sortScreens,
  zoom,
  switchViewMode,
  scrollToScreen,
  toggleDrawer,
  switchScreenDirection,
  initialize,
  toggleScreenDialog,
  toggleUserAgentDialog,
  saveUserAgent,
  toggleHelpDialog,
  deleteScreen,
  appReset,
  toggleSyncScroll,
  toggleSyncClick,
} from '../actions'
import uuid from 'uuid'

const mapStateToProps = state => {
  return {
    // App States
    screens: state.app.screens,
    userAgents: state.app.userAgents,
    url: state.app.url,
    versionedUrl: state.app.versionedUrl,
    viewMode: state.app.viewMode,
    zoom: state.app.zoom,
    screenDirection: state.app.screenDirection,
    syncScroll: state.app.syncScroll,
    syncClick: state.app.syncClick,

    // Layout state
    drawerOpened: state.layout.drawerOpened,
    screenDialog: state.layout.screenDialog,
    userAgentDialog: state.layout.userAgentDialog,
    helpDialog: state.layout.helpDialog,
    initialized: state.layout.initialized,
  }
}

const mapDispatchToProps = dispatch => ({
  updateUrl: ({ url }) => dispatch(updateUrl(url)),
  saveScreen: screen =>
    dispatch(saveScreen({ ...screen, id: screen.id ? screen.id : uuid.v4() })),
  updateVisibility: (id, visibility) =>
    dispatch(updateVisibility(id, visibility)),
  sortScreens: data => dispatch(sortScreens(data)),
  onZoom: value => dispatch(zoom(value)),
  switchViewMode: value => dispatch(switchViewMode(value)),
  scrollToScreen: id => dispatch(scrollToScreen(id)),
  toggleDrawer: () => dispatch(toggleDrawer()),
  switchScreenDirection: value => dispatch(switchScreenDirection(value)),
  initialize: () => dispatch(initialize()),
  toggleScreenDialog: initialValues =>
    dispatch(toggleScreenDialog(initialValues)),
  toggleUserAgentDialog: initialValues =>
    dispatch(toggleUserAgentDialog(initialValues)),
  saveUserAgent: values => dispatch(saveUserAgent(values)),
  toggleHelpDialog: () => dispatch(toggleHelpDialog()),
  deleteScreen: id => dispatch(deleteScreen(id)),
  appReset: () => dispatch(appReset()),
  toggleSyncScroll: () => dispatch(toggleSyncScroll()),
  toggleSyncClick: () => dispatch(toggleSyncClick()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
