import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ToolbarButton from './ToolbarButton'
import Snackbar from '@material-ui/core/Snackbar'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  snackbar: {
    background: theme.palette.danger.main,
    padding: theme.spacing(1, 2),
  },
}))
const validateConfig = config => {
  if (!config.screens) {
    throw new Error('Invalid screens')
  }

  for (let screen of config.screens) {
    if (typeof screen.width !== 'number') {
      throw new Error('Invalid screens')
    }
    if (typeof screen.height !== 'number') {
      throw new Error('Invalid screens')
    }
    if (screen.userAgent && typeof screen.userAgent !== 'string') {
      throw new Error('Invalid screens')
    }
    if (typeof screen.id !== 'string') {
      throw new Error('Invalid screens')
    }
  }
  if (!config.userAgents) {
    throw new Error('Invalid screens')
  }

  for (let screen of config.userAgents) {
    if (typeof screen.name !== 'string') {
      throw new Error('Invalid userAgents')
    }
    if (typeof screen.value !== 'string') {
      throw new Error('Invalid userAgents')
    }
  }

  if (typeof config.zoom !== 'number') {
    config.zoom = 1
  }

  return config
}
export default function Export({ exportApp, importApp }) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [error, setError] = useState()
  const [hasError, setHasError] = useState()

  const classes = useStyles()
  const handleCloseAlert = () => setHasError(false)

  return (
    <div>
      <Snackbar
        open={hasError}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        className={classes.snackbar}
      >
        <>
          <Box>{error}</Box>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseAlert}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      </Snackbar>

      <ToolbarButton
        title="Export/Import"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <svg
          style={{
            width: 18,
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
      </ToolbarButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={exportApp}>Export settings</MenuItem>
        <MenuItem>
          <input
            type="file"
            style={{
              opacity: 0,
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              right: 0,
              width: '100%',
              height: '100%',
            }}
            onChange={event => {
              const reader = new FileReader()
              reader.onload = event => {
                try {
                  const data = validateConfig(JSON.parse(event.target.result))
                  importApp(data)
                } catch (error) {
                  setError('Invalid settings file')
                  setHasError(true)
                }
              }
              reader.readAsText(event.target.files[0])
            }}
          />
          Import settings
        </MenuItem>
      </Menu>
    </div>
  )
}
