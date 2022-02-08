import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  selected: {
    background: `${theme.palette.primary.main}`,
    color: `${theme.palette.primary.contrastText}`,
    '&:hover': {
      background: `${theme.palette.primary.main}`,
    },
  },
}))
const ToolbarButton = ({ isSelected, children, ...props }) => {
  const classes = useStyles()

  return (
    <IconButton
      color="inherit"
      size="small"
      className={isSelected ? classes.selected : null}
      {...props}
    >
      {children}
    </IconButton>
  )
}

export default ToolbarButton
