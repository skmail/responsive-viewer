import React from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import IconButton from '@mui/material/IconButton'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { toggleScreenDialog } from '../../../reducers/layout'
import { Device } from '../../../types'

interface Props {
  screen: Device
}
const Settings = ({ screen }: Props) => {
  const dispatch = useAppDispatch()

  const onClick = () => {
    dispatch(toggleScreenDialog(screen))
  }

  return (
    <IconButton
      sx={{
        color: 'GrayText',
      }}
      size={'small'}
      onClick={onClick}
    >
      <SettingsIcon fontSize={'small'} />
    </IconButton>
  )
}

export default Settings
