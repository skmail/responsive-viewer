import React from 'react'
import SettingsIcon from '@material-ui/icons/Settings'
import IconButton from '@material-ui/core/IconButton'
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
    <IconButton size={'small'} onClick={onClick}>
      <SettingsIcon fontSize={'small'} />
    </IconButton>
  )
}

export default Settings
