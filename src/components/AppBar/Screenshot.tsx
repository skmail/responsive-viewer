import React, { MouseEvent, useState } from 'react'
import CameraIcon from '@mui/icons-material/CameraAlt'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import ToggleButton from '../ToggleButton'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { ScreenshotType } from '../../types'
import { screenshot } from '../../reducers/layout'

const Screenshot = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const onClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLDivElement)
  }

  const dispatch = useAppDispatch()

  const handleMenuItemClick = (type: ScreenshotType) => {
    dispatch(screenshot({ screens: [], type }))
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <ToggleButton
        title="take a screenshot for all screens"
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
          <MenuItem onClick={() => handleMenuItemClick(ScreenshotType.partial)}>
            Capture visible page
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(ScreenshotType.full)}>
            Capture full page
          </MenuItem>
        </Menu>
      )}
    </React.Fragment>
  )
}

export default Screenshot
