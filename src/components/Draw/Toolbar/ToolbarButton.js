import React from 'react'
import IconButton from '@mui/material/IconButton'
import { makeStyles } from '@mui/material/styles'

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
