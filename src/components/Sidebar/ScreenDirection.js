import React from 'react'
import Heading from './Heading'
import ToggleButton from './ToggleButton'
import Box from '@material-ui/core/Box'
const ScreenDirection = props => {
  const { value, onChange } = props
  const modes = [
    {
      name: 'portrait',
      label: 'Portrait',
    },
    {
      name: 'landscape',
      label: 'Landscape',
    },
  ]
  return (
    <React.Fragment>
      <Heading>Screen Direction</Heading>
      <Box display="flex" alignItems="center">
        {modes.map(mode => (
          <ToggleButton
            key={mode.name}
            onClick={() => onChange(mode.name)}
            active={value === mode.name}
            margin
          >
            {mode.label}
          </ToggleButton>
        ))}
      </Box>
    </React.Fragment>
  )
}

export default ScreenDirection
