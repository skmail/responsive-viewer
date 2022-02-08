import React, { useEffect } from 'react'
import AppBar from './AppBar'
import Screens from './Screens'
import { makeStyles } from '@material-ui/core/styles'
import Sidebar from './Sidebar'
import ScreenDialog from './ScreenDialog'
import UserAgentDialog from './UserAgentDialog'
import HelpDialog from './HelpDialog'
import Tabs from './Tabs'
import TabDialog from './TabDialog'
import Draw from './Draw'

const useStyles = makeStyles(theme => {
  return {
    root: {
      overflow: 'hidden',
      height: '100vh',
      display: 'flex',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'hidden',
    },
  }
})

function App(props) {
  const {
    activeScreens,
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
    exportApp,
    importApp,
    refresh,
  } = props

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const onRefresh = e => {
      let isF5 = false
      let isR = false

      const code = e.code
      if (code === 'F5') {
        isF5 = true
      }

      if (code === 'KeyR') {
        isR = true
      }

      if (isF5 || ((e.ctrlKey || e.metaKey) && isR)) {
        e.preventDefault()
        refresh()
      }
    }

    window.addEventListener('keydown', onRefresh)

    return () => {
      window.removeEventListener('keydown', onRefresh)
    }
  }, [refresh])
  const classes = useStyles(props)

  if (!initialized) {
    return <div>Loading ...</div>
  }
  return (
    <div className={classes.root}>
      <TabDialog />
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
        exportApp={exportApp}
        importApp={importApp}
      />

      <Draw />
      <div className={classes.content}>
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
        <Tabs />
        <Screens
          zoom={zoom}
          viewMode={viewMode}
          screens={activeScreens}
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
