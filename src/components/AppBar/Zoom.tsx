import React, { ReactElement } from 'react'
import MuiSlider from '@mui/material/Slider'
import IconButton from '@mui/material/IconButton'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectZoom, updateZoom } from '../../reducers/app'
import { useAppDispatch } from '../../hooks/useAppDispatch'

import { styled } from '@mui/material/styles'

const Slider = styled(MuiSlider)(({ theme }) => ({
  width: 200,
  '& .MuiSlider-markLabel': {
    fontSize: 12,
  },
}))

function zoomText(value: number) {
  return `${parseInt(String(value * 100))}%`
}

function ValueLabelComponent({
  children,
  value,
}: {
  children: ReactElement
  value: number
}) {
  return (
    <Tooltip placement="bottom" title={value}>
      {children}
    </Tooltip>
  )
}

const Zoom = () => {
  const value = useAppSelector(selectZoom)
  const dispatch = useAppDispatch()

  const onChange = (value: number) => {
    dispatch(updateZoom(value))
  }

  const maxZoom = 2
  const minZoom = 0.1
  const zoomStep = 0.1

  const canZoomIn = value >= maxZoom
  const canZoomOut = value <= minZoom

  const zoomIn = () => onChange(value + zoomStep)
  const zoomOut = () => onChange(value - zoomStep)

  return (
    <Box display={'flex'} alignItems={'center'}>
      <IconButton disabled={canZoomOut} onClick={zoomOut}>
        <ZoomOutIcon />
      </IconButton>
      <Slider
        value={value}
        onChange={(event, value) =>
          onChange(Array.isArray(value) ? value[0] : value)
        }
        components={{
          ValueLabel: ValueLabelComponent,
        }}
        getAriaValueText={zoomText}
        valueLabelFormat={zoomText}
        step={zoomStep}
        min={minZoom}
        max={maxZoom}
        valueLabelDisplay="auto"
        marks={[
          {
            value: 1,
          },
          {
            value: 0.5,
          },
          {
            value: 1.5,
          },
        ]}
      />
      <IconButton disabled={canZoomIn} onClick={zoomIn}>
        <ZoomInIcon />
      </IconButton>
    </Box>
  )
}

export default Zoom
