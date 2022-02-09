import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import Screens from './Screens'
import Toolbar from './Toolbar'
import Advertisement from '../Advertisement'

const drawerWidth = 250

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
    height: '100%',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    padding: 0,
    height: '100%',
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flex: 1,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },

  advertisement: {
    position: 'sticky',
    top: 0,

    zIndex: 99999,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

const Sidebar = () => {
  const classes = useStyles()

  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
      open={true}
    >
      <div className={classes.advertisement}>
        <Advertisement />
      </div>

      <div className={classes.grow}>
        <Toolbar />

        <Screens />
      </div>
    </Drawer>
  )
}

export default Sidebar
