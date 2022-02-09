import React from 'react'

import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import BaseSlider from '@mui/material/Slider'

import { makeStyles } from '@mui/material/styles'
const width = 200
const useStyles = makeStyles(theme => ({
  root: {
    width,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    padding: theme.spacing(1),
  },
}))

const Slider = ({ value, onChange, children }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const id = open ? 'simple-popover' : undefined

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
        <BaseSlider
          value={value}
          onChange={(e, value) => {
            onChange(value)
          }}
        />
      </Popover>
    </>
  )
}

export default Slider
