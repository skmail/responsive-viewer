import React from 'react'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import Color from './Color'
import { makeStyles } from '@material-ui/core/styles'
const width = 170
const useStyles = makeStyles(theme => ({
  root: {
    width,
    padding: theme.spacing(1),
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
  },

  saturation: {
    position: 'relative',
    height: width / 1.5,
    margin: theme.spacing(-1),
  },
  hue: {
    height: 10,
    position: 'relative',
  },
  alpha: {
    height: 10,
    position: 'relative',
    background: '#fff',
  },
  inputs: {
    display: 'flex',
  },
  input: {
    fontSize: 12,
  },
}))

const ColorPopover = ({ color, onChange, children }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const id = open ? 'color-popover' : undefined

  const classes = useStyles()

  return (
    <>
      <Button aria-describedby={id} onClick={handleClick}>
        {children}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        classes={{
          paper: classes.root,
        }}
      >
        <Color color={color} onChange={onChange} />
      </Popover>
    </>
  )
}

export default ColorPopover
