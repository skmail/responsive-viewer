import React, { useState, MouseEvent } from 'react'
import CameraIcon from '@mui/icons-material/CameraAlt'
import IconButton from '@mui/material/IconButton'

import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { ScreenshotType } from '../../../types'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { screenshot } from '../../../reducers/screenshots'

interface Props {
  id: string
}

const Screenshot = ({ id }: Props) => {
  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const onClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement)
  }

  const handleMenuItemClick = (type: ScreenshotType) => {
    dispatch(
      screenshot({
        screens: [id],
        type,
      })
    )
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <IconButton
        sx={{
          color: 'GrayText',
        }}
        size={'small'}
        onClick={onClick}
      >
        <CameraIcon fontSize={'small'} />
      </IconButton>

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
          Capture entire page
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default Screenshot
