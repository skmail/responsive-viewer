import React, { ElementType } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const Root = styled('div')(({ theme }) => ({
  minHeight: `100%`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  fontSize: 20,
  color: theme.palette.text.secondary,
}))

interface Props {
  icon: ElementType
  message: string
}
const EmptyState = ({ icon, message }: Props) => {
  return (
    <Root>
      <Box component={icon} sx={{ fontSize: 80 }} />
      {message}
    </Root>
  )
}

export default EmptyState
