import React from 'react'
import SettingsIcon from '@material-ui/icons/Settings'
import IconButton from '@material-ui/core/IconButton'
import { useDispatch } from 'react-redux'
import { toggleScreenDialog } from '../../../actions'
const Settings = props => {
  const { classes, screen } = props

  const dispatch = useDispatch()

  const onClick = () => {
    dispatch(toggleScreenDialog(screen))
  }

  return (
    <IconButton className={classes.action} size={'small'} onClick={onClick}>
      <SettingsIcon fontSize={'small'} />
    </IconButton>
  )
}

export default Settings
