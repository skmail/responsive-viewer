import React from 'react'
import Heading from './Heading'
import ToggleButton from './ToggleButton'

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
      {modes.map(mode => (
        <ToggleButton
          key={mode.name}
          fullWidth
          onClick={() => onChange(mode.name)}
          active={value === mode.name}
        >
          {mode.label}
        </ToggleButton>
      ))}
    </React.Fragment>
  )
}

export default ScreenDirection
