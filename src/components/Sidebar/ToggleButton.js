import React from 'react'
import { makeStyles, fade } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'

const useStyles = makeStyles(theme => ({
  button: {
    justifyContent: 'flex-start',
    fontSize: 12,
    marginTop: theme.spacing(0.5),
  },
  activeButton: {
    backgroundColor: fade(theme.palette.secondary.main, 0.1),
  },
  margin: {
    '&:nth-child(odd)': {
      marginRight: theme.spacing(0.5),
    },
    '&:nth-child(even)': {
      marginLeft: theme.spacing(0.5),
    },
  },
}))

const ToggleButton = props => {
  const { active, margin = false, ...rest } = props
  const classes = useStyles()
  return (
    <Button
      {...rest}
      classes={{
        root: classNames(
          classes.button,
          active ? classes.activeButton : null,
          margin ? classes.margin : null
        ),
      }}
    />
  )
}

export default ToggleButton
