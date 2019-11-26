import React from 'react'
import Heading from './Heading'
import ToggleButton from './ToggleButton'
import Box from '@material-ui/core/Box'
const ViewMode = props => {
  const { value, onChange } = props

  const modes = [
    {
      name: 'vertical',
      label: 'Vertical',
    },
    {
      name: 'horizontal',
      label: 'Horizontal',
    },
  ]
  return (
    <React.Fragment>
      <Heading>View mode</Heading>
      <Box display="flex" alignItems="center">
        {modes.map(mode => (
          <ToggleButton
            key={mode.name}
            margin
            onClick={() => onChange(mode.name)}
            active={value === mode.name}
          >
            {mode.label}
          </ToggleButton>
        ))}
      </Box>
    </React.Fragment>
  )
}

export default ViewMode
