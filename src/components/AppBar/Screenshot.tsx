import React, { MouseEvent, useState } from 'react'
import CameraIcon from '@mui/icons-material/CameraAlt'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { ScreenshotType } from '../../types'
import { screenshot } from '../../reducers/screenshots'
import Tooltip from '@mui/material/Tooltip'

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
      <Tooltip arrow title={`Screenshot all screens`}>
        <IconButton onClick={onClick}>
          <CameraIcon fontSize={'small'} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
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
    </React.Fragment>
  )
}

export default Screenshot
