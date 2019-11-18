import React from 'react'
import Heading from './Heading'
import ToggleButton from './ToggleButton'

const ViewMode = props => {
  const { value, onChange } = props

  const modes = [
    {
      name: 'vertical',
      label: 'Vertical View',
    },
    {
      name: 'horizontal',
      label: 'Horizontal View',
    },
  ]
  return (
    <React.Fragment>
      <Heading>View mode</Heading>
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

export default ViewMode
