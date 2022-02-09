import React from 'react'

import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import BaseSlider from '@mui/material/Slider'
import { makeStyles } from '@mui/material/styles'
import Color from './Color'
import { applyStrokeDashArray } from '../../utils/stroke'
const width = 350
const useStyles = makeStyles(theme => ({
  root: {
    width,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    padding: theme.spacing(1),
    display: 'flex',
  },
  colorPicker: {
    flexShrink: 0,
    width: 170,
    margin: theme.spacing(-1, 1, -1, 0),
    padding: theme.spacing(1, 1, 1, 0),
    borderRight: `1px solid ${theme.palette.primary.main}`,
  },
  row: {},
  slider: {
    padding: theme.spacing(0, 1),
  },
  boxIcon: {
    width: '100%',
    height: 10,
  },
  iconButton: {
    width: '100%',
    padding: theme.spacing(0.5, 1),
  },
}))

const dashes = [null, [2, 2], [4, 4], [9, 9], [29, 20, 0.001, 20]]

const BoxIcon = ({ dashArray }) => {
  const classes = useStyles()
  const strokeWidth = 2
  return (
    <svg
      className={classes.boxIcon}
      width="200"
      height="10"
      viewBox="0 0 200 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        strokeWidth={strokeWidth}
        strokeDasharray={applyStrokeDashArray(dashArray, strokeWidth)}
        strokeLinecap="round"
        strokeLinejoin="round"
        x1="4.37114e-08"
        y1="4.5"
        x2="200"
        y2="4.50002"
        stroke="currentColor"
      />
    </svg>
  )
}
const Stroke = ({ dash = [0, 0], strokeWidth, stroke, onChange, children }) => {
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
        <div className={classes.colorPicker}>
          <Color
            onChange={color =>
              onChange({
                stroke: `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b}, ${color.rgb.a})`,
              })
            }
            color={stroke}
          />
        </div>

        <div>
          <div className={classes.row}>
            Stroke width
            <div className={classes.slider}>
              <BaseSlider
                onChange={(e, value) => {
                  onChange({
                    strokeWidth: value,
                  })
                }}
                value={strokeWidth || 0}
                max={10}
                min={0}
              />
            </div>
          </div>

          <div className={classes.section}>
            Dash
            {dashes.map((dash, index) => (
              <Button
                key={index}
                size="small"
                onClick={() =>
                  onChange({
                    dash,
                  })
                }
                className={classes.iconButton}
              >
                <BoxIcon dashArray={dash} />
              </Button>
            ))}
          </div>
        </div>
      </Popover>
    </>
  )
}

export default Stroke
