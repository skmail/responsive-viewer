import { useState, MouseEvent } from 'react'

import MuiPopover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import { styled, alpha } from '@mui/material/styles'
import Color from './Color'
import { applyStrokeDashArray } from '../../utils/stroke'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { selectSelectedElement, updateElement } from '../../../../reducers/draw'
const width = 350

const Popover = styled(MuiPopover)(({ theme }) => ({
  '& .MuiPaper-root': {
    width,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    padding: theme.spacing(1),
    display: 'flex',
  },
}))

const ColorPicker = styled('div')(({ theme }) => ({
  flexShrink: 0,
  width: 170,
  margin: theme.spacing(-1, 1, -1, 0),
  padding: theme.spacing(1, 1, 1, 0),
  borderRight: `1px solid ${theme.palette.primary.main}`,
}))

const StyledDashIcon = styled('svg')(({ theme }) => ({
  width: '100%',
  height: 10,
}))

const DashButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(0.5, 1),
  color: alpha(theme.palette.text.secondary, 0.5),
}))

const dashes = [undefined, [2, 2], [4, 4], [9, 9], [29, 20, 0.001, 20]]

const BoxIcon = ({ dashArray }: { dashArray?: number[] }) => {
  const strokeWidth = 3
  return (
    <StyledDashIcon
      width="200"
      height="10"
      viewBox="0 0 200 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        strokeWidth={strokeWidth}
        strokeDasharray={applyStrokeDashArray(dashArray, strokeWidth).join(' ')}
        strokeLinecap="round"
        strokeLinejoin="round"
        x1="4.37114e-08"
        y1="4.5"
        x2="200"
        y2="4.50002"
        stroke="currentColor"
      />
    </StyledDashIcon>
  )
}
const Stroke = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const dispatch = useAppDispatch()
  const element = useAppSelector(selectSelectedElement)
  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <Button aria-describedby={id} onClick={handleClick}>
        Stroke
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
      >
        <ColorPicker>
          <Color
            onChange={color =>
              dispatch(
                updateElement({
                  id: element.id,
                  props: {
                    stroke: `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b}, ${color.rgb.a})`,
                  },
                })
              )
            }
            color={element.stroke}
          />
        </ColorPicker>

        <div>
          <div>
            Stroke width
            <Slider
              onChange={(e, strokeWidth) => {
                dispatch(
                  updateElement({
                    id: element.id,
                    props: {
                      strokeWidth: Array.isArray(strokeWidth)
                        ? strokeWidth[0]
                        : strokeWidth,
                    },
                  })
                )
              }}
              value={element.strokeWidth || 0}
              max={10}
              min={0}
            />
          </div>

          <div>
            Dash
            {dashes.map((dash, index) => (
              <DashButton
                key={index}
                onClick={() =>
                  dispatch(
                    updateElement({
                      id: element.id,
                      props: {
                        dash,
                      },
                    })
                  )
                }
              >
                <BoxIcon dashArray={dash} />
              </DashButton>
            ))}
          </div>
        </div>
      </Popover>
    </>
  )
}

export default Stroke
