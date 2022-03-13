import React from 'react'
import Box from '@mui/material/Box'
import Screenshot from './Actions/Screenshot'
import Settings from './Actions/Settings'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectScreenById, selectScreenDirection } from '../../reducers/app'
import { styled, darken } from '@mui/material/styles'
import Stack from '@mui/material/Stack'

const ScreenName = styled('span')(({ theme }) => ({
  fontSize: 12,
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
}))
const ScreenSize = styled('span')(({ theme }) => ({
  fontSize: 12,
  color: darken(theme.palette.text.secondary, 0.3),
}))
interface Props {
  id: string
}
const Header = ({ id }: Props) => {
  const screen = useAppSelector(state => selectScreenById(state, id))
  const screenDirection = useAppSelector(selectScreenDirection)
  return (
    <Box display="flex" justifyContent="space-between" alignItems={'center'}>
      <Stack direction="row" spacing={2} alignItems={'center'}>
        <ScreenName>{screen.name}</ScreenName>
        <ScreenSize>
          {screenDirection === 'landscape'
            ? `${screen.height}x${screen.width}`
            : `${screen.width}x${screen.height}`}
        </ScreenSize>
      </Stack>

      <Box display={'flex'} alignItems={'center'}>
        <Settings screen={screen} />
        <Screenshot id={screen.id} />
      </Box>
    </Box>
  )
}

export default Header
