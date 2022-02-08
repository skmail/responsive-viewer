import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import Screens from './Screens'
import classNames from 'classnames'
import Toolbar from './Toolbar'
import Advertisement from '../Advertisement'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: theme.drawerWidth,
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  },
  drawerPaper: {
    width: theme.drawerWidth,
    padding: 0,
    height: '100vh',
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flex: 1,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  drawerOpen: {
    width: theme.drawerWidth,
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    transform: `translateX(-${theme.drawerWidth}px)`,
  },
  advertisement: {
    position: 'sticky',
    top: 0,

    zIndex: 99999,
  },
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const Sidebar = props => {
  const {
    screens,
    updateVisibility,
    sortScreens,
    scrollToScreen,
    toggleScreenDialog,
    syncScroll,
    toggleSyncScroll,
    syncClick,
    toggleSyncClick,
    searchElement,
    inspectByMouse,
    toggleInspectByMouse,
    exportApp,
    importApp,
  } = props

  const open = true

  const classes = useStyles()

  return (
    <Drawer
      position="static"
      variant="permanent"
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: classNames(classes.drawerPaper, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      anchor="left"
      open={open}
    >
      <div className={classes.container}>
        <div className={classes.advertisement}>
          <Advertisement />
        </div>

        <div className={classes.grow}>
          <Toolbar
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

          <Screens
            onClick={scrollToScreen}
            screens={screens}
            updateVisibility={updateVisibility}
            toggleScreenDialog={toggleScreenDialog}
            sortScreens={sortScreens}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default Sidebar
