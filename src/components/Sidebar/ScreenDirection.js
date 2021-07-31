import React from 'react'
import Heading from './Heading'
import ToggleButton from './ToggleButton'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Tooltip from '@material-ui/core/Tooltip'

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
const ScreenDirection = props => {
  const { value, onChange } = props
  const classes = useStyles()

  const directions = [
    {
      name: 'portrait',
      label: 'Portrait',
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
      name: 'landscape',
      label: 'Landscape',
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
  ]
  return (
    <div>
      <Heading>Direction</Heading>
      <Box display="flex" alignItems="center">
        {directions.map(direction => (
          <Tooltip title={direction.label} key={direction.name}>
            <div>
              <ToggleButton
                key={direction.name}
                onClick={() => onChange(direction.name)}
                active={value === direction.name}
                className={classes.button}
              >
                {direction.icon}
              </ToggleButton>
            </div>
          </Tooltip>
        ))}
      </Box>
    </div>
  )
}

export default ScreenDirection
