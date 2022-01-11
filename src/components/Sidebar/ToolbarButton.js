import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles, alpha } from '@material-ui/core/styles'
import classNames from 'classnames'

const useStyles = makeStyles(theme => ({
  button: {
    color: 'rgba(255,255,255,0.7)',
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
  },
  activeButton: {
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    '&:hover': {
      background: alpha(theme.palette.primary.main, 0.8),
    },
  },
}))

const Toolbar = props => {
  const { onClick, active, children, title } = props
  const classes = useStyles()

  return (
    <Tooltip title={title}>
      <IconButton
        type="button"
        size="small"
        onClick={onClick}
        color="secondary"
        classes={{
          root: classNames(
            classes.button,
            active ? classes.activeButton : null
          ),
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  )
}

export default Toolbar
