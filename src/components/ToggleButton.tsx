import React from 'react'
import MuiIconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

interface Props extends IconButtonProps {
  active?: boolean
}

const IconButton = styled(({ active, ...rest }: Props) => (
  <MuiIconButton {...rest} />
))<Props>(({ theme, active }) => ({
  color: active ? theme.palette.primary.contrastText : undefined,
  background: active ? theme.palette.primary.main : undefined,
  '&:hover': {
    background: active ? theme.palette.primary.main : undefined,
  },
}))

export default IconButton
