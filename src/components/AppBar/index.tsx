import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import AddressBar from './AddressBar'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import HelpIcon from '@material-ui/icons/Help'
import Zoom from '../Sidebar/Zoom'
import TwitterIcon from '@material-ui/icons/Twitter'

import Screenshot from './Screenshot'
import ViewMode from './ViewMode'
import ScreenDirection from './ScreenDirection'

import { useAppDispatch } from '../../hooks/useAppDispatch'
import { toggleHelpDialog, toggleScreenDialog } from '../../reducers/layout'

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    zIndex: theme.zIndex.drawer + 1,
    width: '100%',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  logo: {
    height: 40,
  },
  toolbar: {
    alignItems: 'center',
  },
}))

const AppBar = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()

  return (
    <MuiAppBar position="static" color="default" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <img
          src="https://responsive-viewer-ads.netlify.app/logo.png"
          alt="Responsive Viewer"
          className={classes.logo}
        />
        <AddressBar />
        <Box display="flex">
          <ViewMode />
          <ScreenDirection />
          <Screenshot />
        </Box>
        <Zoom />

        <div className={classes.grow} />

        <Button color="primary" href="https://ko-fi.com/skmail" target="_blank">
          Buy me a coffee
        </Button>

        <IconButton
          href="https://twitter.com/SolaimanKmail"
          target="_blank"
          edge="end"
          aria-label="Follow me on twitter"
          aria-haspopup="true"
          color="inherit"
        >
          <TwitterIcon />
        </IconButton>

        <IconButton
          onClick={() => dispatch(toggleHelpDialog())}
          edge="end"
          aria-label="Add Screen"
          aria-haspopup="true"
          color="inherit"
        >
          <HelpIcon />
        </IconButton>

        <IconButton
          onClick={() => dispatch(toggleScreenDialog())}
          edge="end"
          aria-label="Add Screen"
          aria-haspopup="true"
          color="inherit"
        >
          <AddIcon />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  )
}

export default AppBar
