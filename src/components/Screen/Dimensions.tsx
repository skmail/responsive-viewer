import { useState } from 'react'
import { useAppSelector } from '../../hooks/useAppSelector'
import {
  saveScreen,
  selectScreenById,
  selectScreenDirection,
} from '../../reducers/app'
import { Box, darken, styled } from '@mui/material'
import { useAppDispatch } from '../../hooks/useAppDispatch'

const ScreenSize = styled('span')(({ theme }) => ({
  fontSize: 12,
  color: darken(theme.palette.text.secondary, 0.3),
  display: 'flex',
  alignItems: 'center',
}))

const SizeInput = styled('input')(({ theme }) => ({
  padding: 0,
  fontSize: 12,
  background: 'transparent',
  border: 'none',
  color: darken(theme.palette.text.secondary, 0.3),
  width: '100%',
  resize: 'none',
  outline: 'none',
  position: 'absolute',
}))

const InputRoot = styled('label')(({ theme }) => ({
  display: 'inline-grid',
  position: 'relative',
  '&:after': {
    content: 'attr(data-value) ',
    visibility: 'hidden',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.1,
  },
  '&:focus-within': {
    outline: `2px solid  ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}))
const Dimension = ({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      {isEditing ? (
        <InputRoot data-value={value}>
          <SizeInput
            autoFocus
            value={value}
            onChange={e => {
              let value = parseInt(e.target.value)
              if (isNaN(value)) {
                return
              }

              onChange(value)
            }}
            onBlur={() => setIsEditing(false)}
          />
        </InputRoot>
      ) : (
        <span onClick={() => setIsEditing(true)}>{value}</span>
      )}
    </>
  )
}
export function Dimensions({ id }: { id: string }) {
  const screen = useAppSelector(state => selectScreenById(state, id))

  const screenDirection = useAppSelector(selectScreenDirection)
  const dispatch = useAppDispatch()

  return (
    <ScreenSize sx={{ marginLeft: 2 }}>
      <Dimension
        value={screenDirection !== 'landscape' ? screen.width : screen.height}
        onChange={value => {
          dispatch(
            saveScreen({
              ...screen,
              [screenDirection !== 'landscape' ? 'width' : 'height']: value,
            })
          )
        }}
      />
      <Box sx={{ px: 0.5 }}>x</Box>
      <Dimension
        value={screenDirection !== 'landscape' ? screen.height : screen.width}
        onChange={value => {
          dispatch(
            saveScreen({
              ...screen,
              [screenDirection !== 'landscape' ? 'height' : 'width']: value,
            })
          )
        }}
      />
    </ScreenSize>
  )
}
