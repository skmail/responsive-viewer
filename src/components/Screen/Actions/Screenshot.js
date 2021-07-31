import React from 'react'
import CameraIcon from '@material-ui/icons/CameraAlt'
import IconButton from '@material-ui/core/IconButton'

import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

const Screenshot = props => {
  const { classes, screenshot, screen } = props

  const [anchorEl, setAnchorEl] = React.useState(null)

  const onClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = type => {
    screenshot(screen, type)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <IconButton className={classes.action} size={'small'} onClick={onClick}>
        <CameraIcon fontSize={'small'} />
      </IconButton>
      {!!anchorEl && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick('visible')}>
            Capture visible page
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('full')}>
            Capture entire page
          </MenuItem>
        </Menu>
      )}
    </React.Fragment>
  )
}

export default Screenshot
