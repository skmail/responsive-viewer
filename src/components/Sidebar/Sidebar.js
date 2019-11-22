import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import Screens from './Screens'
import Zoom from './Zoom'
import ViewMode from './ViewMode'
import classNames from 'classnames'
import ScreenDirection from './ScreenDirection'
import Toolbar from './Toolbar'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: theme.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: theme.drawerWidth,
    padding: theme.spacing(2),
    height: '100vh',
    paddingBottom: theme.spacing(4),
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flex: 1,
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
}))

const Sidebar = props => {
  const {
    screens,
    updateVisibility,
    sortScreens,
    zoom,
    onZoom,
    viewMode,
    switchViewMode,
    scrollToScreen,
    open,
    switchScreenDirection,
    screenDirection,
    toggleScreenDialog,
    syncScroll,
    toggleSyncScroll,
    syncClick,
    toggleSyncClick,
  } = props

  const classes = useStyles()

  return (
    <Drawer
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
      <div className={classes.toolbar} />

      <div className={classes.grow}>
        <Toolbar
          syncScroll={syncScroll}
          toggleSyncScroll={toggleSyncScroll}
          syncClick={syncClick}
          toggleSyncClick={toggleSyncClick}
        />

        <Screens
          onClick={scrollToScreen}
          screens={screens}
          updateVisibility={updateVisibility}
          toggleScreenDialog={toggleScreenDialog}
          sortScreens={sortScreens}
        />

        <ViewMode value={viewMode} onChange={switchViewMode} />
        <ScreenDirection
          value={screenDirection}
          onChange={switchScreenDirection}
        />
      </div>

      <Zoom value={zoom} onChange={onZoom} />
    </Drawer>
  )
}

export default Sidebar
