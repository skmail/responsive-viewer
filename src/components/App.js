import React, { useEffect } from 'react'
import AppBar from './AppBar'
import Screens from './Screens'
import { makeStyles } from '@material-ui/core/styles'
import Sidebar from './Sidebar'
import ScreenDialog from './ScreenDialog'
import UserAgentDialog from './UserAgentDialog'
import HelpDialog from './HelpDialog'

const useStyles = makeStyles(theme => {
  return {
    root: {
      overflow: 'hidden',
      transform: 'translate3d(0,0,0)',
    },
    toolbar: theme.mixins.toolbar,
    content: props => ({
      width: `calc(100% - ${props.drawerOpened ? theme.drawerWidth : 0}px)`,
      marginLeft: props.drawerOpened ? theme.drawerWidth : 0,
    }),
  }
})

function App(props) {
  const {
    screens,
    updateScreen,
    updateUrl,
    url,
    versionedUrl,
    saveScreen,
    updateVisibility,
    sortScreens,
    zoom,
    onZoom,
    viewMode,
    switchViewMode,
    scrollToScreen,
    toggleDrawer,
    drawerOpened,
    switchScreenDirection,
    screenDirection,
    initialize,
    userAgents,
    screenDialog,
    toggleScreenDialog,
    saveUserAgent,
    toggleUserAgentDialog,
    userAgentDialog,
    helpDialog,
    toggleHelpDialog,
    deleteScreen,
    appReset,
    syncScroll,
    toggleSyncScroll,
    syncClick,
    toggleSyncClick,
    initialized,
    searchElement,
    inspectByMouse,
    toggleInspectByMouse,
    screenshot,
  } = props

  useEffect(() => {
    initialize()
  }, [initialize])

  const classes = useStyles(props)

  if (!initialized) {
    return <div>Loading ...</div>
  }
  return (
    <div className={classes.root}>
      <ScreenDialog
        onSubmit={saveScreen}
        userAgents={userAgents}
        onClose={toggleScreenDialog}
        toggleUserAgentDialog={toggleUserAgentDialog}
        deleteScreen={deleteScreen}
        {...screenDialog}
      />

      <UserAgentDialog
        onSubmit={saveUserAgent}
        userAgents={userAgents}
        onClose={toggleUserAgentDialog}
        {...userAgentDialog}
      />

      <HelpDialog
        onClose={toggleHelpDialog}
        appReset={appReset}
        {...helpDialog}
      />

      <AppBar
        url={url}
        updateUrl={updateUrl}
        toggleDrawer={toggleDrawer}
        userAgents={userAgents}
        toggleScreenDialog={toggleScreenDialog}
        toggleHelpDialog={toggleHelpDialog}
        viewMode={viewMode}
        switchViewMode={switchViewMode}
        switchScreenDirection={switchScreenDirection}
        screenDirection={screenDirection}
        zoom={zoom}
        onZoom={onZoom}
      />
      <div className={classes.toolbar} />
      <Sidebar
        screens={screens}
        updateScreen={updateScreen}
        updateVisibility={updateVisibility}
        sortScreens={sortScreens}
        scrollToScreen={scrollToScreen}
        open={drawerOpened}
        toggleScreenDialog={toggleScreenDialog}
        syncScroll={syncScroll}
        toggleSyncScroll={toggleSyncScroll}
        syncClick={syncClick}
        toggleSyncClick={toggleSyncClick}
        searchElement={searchElement}
        inspectByMouse={inspectByMouse}
        toggleInspectByMouse={toggleInspectByMouse}
      />
      <div className={classes.content}>
        <Screens
          zoom={zoom}
          viewMode={viewMode}
          screens={screens}
          screenDirection={screenDirection}
          url={url}
          versionedUrl={versionedUrl}
          screenshot={screenshot}
        />
      </div>
    </div>
  )
}

export default App
