import React from 'react'
import MuiAppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import AddressBar from './AddressBar'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import HelpIcon from '@mui/icons-material/Help'
import Zoom from './Zoom'
import TwitterIcon from '@mui/icons-material/Twitter'
import Screenshot from './Screenshot'
import ViewMode from './ViewMode'
import ScreenDirection from './ScreenDirection'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { toggleHelpDialog, toggleScreenDialog } from '../../reducers/layout'
import { styled } from '@mui/material/styles'

const Logo = styled('img')(() => ({
  width: 40,
  height: 'auto',
  flexShrink: 0,
  objectFit: 'contain',
}))

const AppBar = () => {
  const dispatch = useAppDispatch()

  return (
    <MuiAppBar position="static" color="default">
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        sx={{
          padding: 1,
        }}
      >
        <Stack spacing={2} direction="row">
          <Logo src="/logo.png" alt="Responsive Viewer" />
          <AddressBar />
        </Stack>
        <Stack spacing={2} direction="row">
          <ViewMode />
          <ScreenDirection />
          <Screenshot />
          <Zoom />
        </Stack>

        <Stack spacing={1} direction="row">
          <Button
            color="primary"
            href="https://ko-fi.com/skmail"
            target="_blank"
          >
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
        </Stack>
      </Stack>
    </MuiAppBar>
  )
}

export default AppBar
