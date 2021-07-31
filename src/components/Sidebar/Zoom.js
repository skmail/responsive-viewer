import React from 'react'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 0),
    width: 250,
  },
  slider: {
    margin: theme.spacing(0, 1, 0, 1),
  },
  sliderMarkLabel: {
    fontSize: 11,
  },
  zoomButton: {
    fontSize: 18,
    padding: theme.spacing(0.5),
    color: theme.palette.secondary.main,
  },
}))

function valuetext(value) {
  return `${parseInt(value * 100)}%`
}

const Zoom = props => {
  const { value, onChange } = props
  const classes = useStyles()
  const maxZoom = 2
  const minZoom = 0.1
  const zoomStep = 0.1

  const canZoomIn = value >= maxZoom
  const canZoomOut = value <= minZoom

  const zoomIn = () => onChange(value + zoomStep)
  const zoomOut = () => onChange(value - zoomStep)

  return (
    <Box className={classes.root} display={'flex'} alignItems={'flex-start'}>
      <IconButton
        classes={{ root: classes.zoomButton }}
        disabled={canZoomOut}
        onClick={zoomOut}
      >
        <ZoomOutIcon fontSize={'inherit'} />
      </IconButton>
      <Slider
        classes={{
          root: classes.slider,
          markLabel: classes.sliderMarkLabel,
        }}
        value={value}
        onChange={(event, value) => onChange(value)}
        getAriaValueText={valuetext}
        valueLabelFormat={valuetext}
        step={zoomStep}
        min={minZoom}
        max={maxZoom}
        valueLabelDisplay="auto"
        marks={[
          {
            value: 1,
            label: '100%',
          },
          {
            value: 0.5,
            label: '50%',
          },
          {
            value: 1.5,
            label: '150%',
          },
        ]}
      />
      <IconButton
        classes={{ root: classes.zoomButton }}
        disabled={canZoomIn}
        onClick={zoomIn}
      >
        <ZoomInIcon fontSize={'inherit'} />
      </IconButton>
    </Box>
  )
}

export default Zoom
