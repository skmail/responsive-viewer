import React, { useState, MouseEvent } from 'react'
import CameraIcon from '@material-ui/icons/CameraAlt'
import IconButton from '@material-ui/core/IconButton'

import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { ScreenshotType } from '../../../types'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { screenshot } from '../../../reducers/layout'

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
      <IconButton size={'small'} onClick={onClick}>
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
          <MenuItem onClick={() => handleMenuItemClick(ScreenshotType.partial)}>
            Capture visible page
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(ScreenshotType.full)}>
            Capture entire page
          </MenuItem>
        </Menu>
      )}
    </React.Fragment>
  )
}

export default Screenshot
