import React, { useMemo } from 'react'
import ToggleButton from '../ToggleButton'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { useAppSelector } from '../../hooks/useAppSelector'
import {
  selectScreenDirection,
  switchScreenDirection,
} from '../../reducers/app'
import { useAppDispatch } from '../../hooks/useAppDispatch'

import { ScreenDirection as ScreenDirectionEnum } from '../../types'
const useStyles = makeStyles(theme => ({
  icon: {
    width: 24,
    height: 24,
  },
  button: {
    marginRight: theme.spacing(1),
    width: 40,
    minWidth: 'auto',
  },
  landscape: {
    transform: 'rotate(90deg)',
  },
}))
const ScreenDirection = () => {
  const dispatch = useAppDispatch()
  const screenDirection = useAppSelector(selectScreenDirection)

  const classes = useStyles()

  const directions = useMemo(
    () => [
      {
        name: ScreenDirectionEnum.portrait,
        label: 'Portrait screens',
        icon: (
          <svg
            className={classes.icon}
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
          </svg>
        ),
      },
      {
        name: ScreenDirectionEnum.landscape,
        label: 'Landscape screens',
        icon: (
          <svg
            className={classNames(classes.icon, classes.landscape)}
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
          </svg>
        ),
      },
    ],
    [classes.icon, classes.landscape]
  )

  const direction =
    screenDirection === ScreenDirectionEnum.landscape
      ? directions[0]
      : directions[1]

  return (
    <ToggleButton
      title={direction.label}
      onClick={() => dispatch(switchScreenDirection(direction.name))}
      active={screenDirection === direction.name}
      className={classes.button}
    >
      {direction.icon}
    </ToggleButton>
  )
}

export default ScreenDirection
