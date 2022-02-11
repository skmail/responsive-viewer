import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Screens from './Screens'
import Toolbar from './Toolbar'
import Advertisement from '../Advertisement'
import { styled, darken, lighten } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

interface Props extends BoxProps {
  open: boolean
}
const Drawer = styled(({ open, ...rest }: Props) => <Box {...rest} />)(
  ({ theme, open }) => ({
    position: 'relative',
    width: open ? 225 : 60,
    background: darken(theme.palette.background.default, 0),
    borderRight: `1px solid ${lighten(theme.palette.background.default, 0.2)} `,
  })
)

const Sidebar = () => {
  const theme = useTheme()
  const open = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Drawer open={open}>
      <Advertisement />

      <Toolbar direction={open ? 'row' : 'column'} />

      <Screens view={open ? 'list' : 'popover'} />
    </Drawer>
  )
}

export default Sidebar
