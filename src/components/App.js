import React, {useEffect} from "react";
import AppBar from "./AppBar";
import Screens from "./Screens";
import {makeStyles} from "@material-ui/core/styles";
import Sidebar from "./Sidebar";
import ScreenDialog from './ScreenDialog'
import UserAgentDialog from "./UserAgentDialog";
import HelpDialog from './HelpDialog'

const useStyles = makeStyles(theme => {
  return {
    root: {
      overflow:"hidden"
    },
    toolbar: theme.mixins.toolbar,
    content: props => ({
      width: `calc(100% - ${props.drawerOpened ?theme.drawerWidth : 0}px)`,
      marginLeft: props.drawerOpened?theme.drawerWidth :0
    })
  };
});

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
    appReset
  } = props

  useEffect(() => {
    initialize()
  },[])

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <ScreenDialog
        onSubmit={saveScreen}
        userAgents={userAgents}
        onClose={toggleScreenDialog}
        toggleUserAgentDialog={toggleUserAgentDialog}
        deleteScreen={deleteScreen}
        {...screenDialog} />

      <UserAgentDialog
        onSubmit={saveUserAgent}
        userAgents={userAgents}
        onClose={toggleUserAgentDialog} {...userAgentDialog} />

      <HelpDialog
        onClose={toggleHelpDialog}
        appReset={appReset}
        {...helpDialog}/>

      <AppBar
        url={url}
        updateUrl={updateUrl}
        toggleDrawer={toggleDrawer}
        userAgents={userAgents}
        toggleScreenDialog={toggleScreenDialog}
        toggleHelpDialog={toggleHelpDialog}
      />
      <div className={classes.toolbar}/>
      <Sidebar
        screens={screens}
        updateScreen={updateScreen}
        updateVisibility={updateVisibility}
        sortScreens={sortScreens}
        zoom={zoom}
        onZoom={onZoom}
        viewMode={viewMode}
        switchViewMode={switchViewMode}
        scrollToScreen={scrollToScreen}
        open={drawerOpened}
        switchScreenDirection={switchScreenDirection}
        screenDirection={screenDirection}
        toggleScreenDialog={toggleScreenDialog}
      />
      <div className={classes.content}>
        <Screens
          zoom={zoom}
          viewMode={viewMode}
          screens={screens}
          screenDirection={screenDirection}
          url={url}
          versionedUrl={versionedUrl}/>
      </div>
    </div>
  );
}

export default App;
