import React from 'react'
import CameraIcon from '@material-ui/icons/CameraAlt'

import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ToggleButton from '../Sidebar/ToggleButton'
import { useDispatch } from 'react-redux'
import { screenshotAll } from '../../actions'

const Screenshot = props => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const onClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const dispatch = useDispatch()

  const handleMenuItemClick = type => {
    dispatch(screenshotAll(type))
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <ToggleButton
        title="take a screenshot from all screens"
        size={'small'}
        onClick={onClick}
      >
        <CameraIcon fontSize={'small'} />
      </ToggleButton>
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
            Capture full page
          </MenuItem>
        </Menu>
      )}
    </React.Fragment>
  )
}

export default Screenshot
