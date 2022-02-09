import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import classNames from 'classnames'

const useStyles = makeStyles(theme => ({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    marginTop: theme.spacing(0.5),
  },
  activeButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}))

interface Props extends IconButtonProps {
  active?: boolean
}

const ToggleButton = ({ active = false, ...rest }: Props) => {
  const classes = useStyles()
  return (
    <IconButton
      size="small"
      {...rest}
      classes={{
        root: classNames(classes.button, active ? classes.activeButton : null),
      }}
    />
  )
}

export default ToggleButton
