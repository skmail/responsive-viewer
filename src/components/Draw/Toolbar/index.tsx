import React from 'react'
import { styled, darken } from '@mui/material/styles'
import ColorPopover from './settings/ColorPopover'
import Stroke from './settings/Stroke'
import { DrawingTool } from '../../../types/draw'
import { useAppSelector } from '../../../hooks/useAppSelector'
import {
  selectDrawingTool,
  selectSelectedElement,
  setDrawingTool,
  updateElement,
} from '../../../reducers/draw'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { shallowEqual } from 'react-redux'
import ToggleButton from '@mui/material/ToggleButton'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

const Root = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  bottom: theme.spacing(4),
  zIndex: 15,
  transform: 'translateX(-50%)',
  background: darken(theme.palette.background.default, 0.15),
  padding: theme.spacing(1),
  borderRadius: 5,

  '& > button': {
    padding: theme.spacing(0.5),
  },
  '& .MuiButton-root': {
    padding: theme.spacing(0.5, 2),
  },
}))

const Icon = styled('svg')(({ theme }) => ({
  width: 30,
  height: 30,
}))

const Toolbar = () => {
  const tools: DrawingTool[] = [
    'pen',
    'text',
    'rect',
    'circle',
    'ellipse',
    'arrow',
  ]
  const dispatch = useAppDispatch()
  const activeDrawingTool = useAppSelector(selectDrawingTool)

  const setActiveTool = (tool: DrawingTool) => {
    dispatch(setDrawingTool(tool))
  }

  const selectedElement = useAppSelector(state => {
    const element = selectSelectedElement(state)

    if (!element) {
      return
    }

    return {
      id: element.id,
      type: element.type,
      fill: element.fill,
    }
  }, shallowEqual)

  return (
    <Root spacing={1} direction="row">
      {tools.map(tool => (
        <ToggleButton
          selected={tool === activeDrawingTool}
          key={tool}
          onClick={() => setActiveTool(tool)}
          value={tool}
        >
          {tool === 'pen' && (
            <Icon viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.8572 27.2999L24.75 8.43301C24.8881 8.19387 25.1939 8.11193 25.433 8.25L28.4935 10.017C28.7326 10.155 28.8146 10.4608 28.6765 10.7L17.7837 29.5669C17.732 29.6564 17.6538 29.7277 17.5599 29.771L14.7801 31.0518C14.4667 31.1963 14.1046 30.9872 14.073 30.6436L13.7923 27.5957C13.7828 27.4928 13.8055 27.3894 13.8572 27.2999Z"
                stroke="currentColor"
                fill="none"
                strokeWidth={1.5}
              />
            </Icon>
          )}

          {tool === 'rect' && (
            <Icon viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="8.75"
                y="8.75"
                width="21.5"
                height="21.5"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
              />
            </Icon>
          )}
          {tool === 'circle' && (
            <Icon viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="19.5"
                cy="19.5"
                r="10.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </Icon>
          )}
          {tool === 'ellipse' && (
            <Icon viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M34.25 20C34.25 21.4685 32.9449 23.0309 30.2894 24.2701C27.6949 25.4809 24.0578 26.25 20 26.25C15.9422 26.25 12.3051 25.4809 9.71056 24.2701C7.05511 23.0309 5.75 21.4685 5.75 20C5.75 18.5315 7.05511 16.9691 9.71056 15.7299C12.3051 14.5191 15.9422 13.75 20 13.75C24.0578 13.75 27.6949 14.5191 30.2894 15.7299C32.9449 16.9691 34.25 18.5315 34.25 20Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </Icon>
          )}
          {tool === 'arrow' && (
            <Icon viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M30.75 9C30.75 8.58579 30.4142 8.25 30 8.25L23.25 8.25C22.8358 8.25 22.5 8.58579 22.5 9C22.5 9.41422 22.8358 9.75 23.25 9.75H29.25V15.75C29.25 16.1642 29.5858 16.5 30 16.5C30.4142 16.5 30.75 16.1642 30.75 15.75L30.75 9ZM9.53033 30.5303L30.5303 9.53033L29.4697 8.46967L8.46967 29.4697L9.53033 30.5303Z"
                fill="currentColor"
              />
            </Icon>
          )}
          {tool === 'text' && (
            <Icon
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.648 10.8965H28.232L28.256 16.4645C27.904 16.5285 27.608 16.5285 27.368 16.4645L26.24 12.1205H21.248V28.9445L23.672 29.1845C23.736 29.4245 23.736 29.7205 23.672 30.0725C22.664 30.0245 21.448 30.0005 20.024 30.0005C18.92 30.0005 17.696 30.0165 16.352 30.0485C16.256 29.7605 16.256 29.4725 16.352 29.1845L18.584 28.8965C18.648 28.2885 18.68 27.3525 18.68 26.0885V12.1205H13.64L12.512 16.4645C12.272 16.5285 11.976 16.5285 11.624 16.4645L11.648 10.8965Z"
                fill="currentColor"
              />
            </Icon>
          )}
        </ToggleButton>
      ))}

      {!!selectedElement && (
        <>
          {['rect', 'circle', 'ellipse', 'text'].includes(
            selectedElement.type
          ) && (
            <ColorPopover
              onChange={color => {
                const rgb = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b}, ${color.rgb.a})`

                dispatch(
                  updateElement({
                    id: selectedElement.id,
                    props: {
                      fill: rgb,
                    },
                  })
                )
              }}
              color={selectedElement.fill}
            >
              fill
            </ColorPopover>
          )}

          {['rect', 'circle', 'ellipse', 'arrow', 'pen'].includes(
            selectedElement.type
          ) && <Stroke />}
        </>
      )}
    </Root>
  )
}

export default Toolbar
