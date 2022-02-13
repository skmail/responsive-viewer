import React, { useMemo } from 'react'
import IconButton from '@mui/material/IconButton'
import { useAppSelector } from '../../hooks/useAppSelector'
import {
  selectScreenDirection,
  switchScreenDirection,
} from '../../reducers/app'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { ScreenDirection as ScreenDirectionEnum } from '../../types'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'

const Icon = styled('svg')(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
}))

const ScreenDirection = () => {
  const dispatch = useAppDispatch()
  const screenDirection = useAppSelector(selectScreenDirection)

  const directions = useMemo(
    () => [
      {
        name: ScreenDirectionEnum.portrait,
        label: 'Portrait mode',
        icon: (
          <Icon
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </Icon>
        ),
      },
      {
        name: ScreenDirectionEnum.landscape,
        label: 'Landscape mode',
        icon: (
          <Icon
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 12v-.01.01Zm3 4V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Icon>
        ),
      },
    ],
    []
  )

  const direction =
    screenDirection === ScreenDirectionEnum.landscape
      ? directions[0]
      : directions[1]

  return (
    <Tooltip arrow title={direction.label}>
      <IconButton
        aria-label={direction.label}
        onClick={() => dispatch(switchScreenDirection(direction.name))}
      >
        {direction.icon}
      </IconButton>
    </Tooltip>
  )
}

export default ScreenDirection
