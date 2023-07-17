import React from 'react'
import Box from '@mui/material/Box'
import Screenshot from './Actions/Screenshot'
import Settings from './Actions/Settings'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectScreenById } from '../../reducers/app'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import { Dimensions } from './Dimensions'

const ScreenName = styled('span')(({ theme }) => ({
  fontSize: 12,
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
}))

interface Props {
  id: string
}

const Header = ({ id }: Props) => {
  const screen = useAppSelector(state => selectScreenById(state, id))

  return (
    <Box display="flex" justifyContent="space-between" alignItems={'center'}>
      <Stack direction="row" spacing={0} alignItems={'center'}>
        <ScreenName sx={{ marginLeft: 0.5 }}>{screen.name}</ScreenName>
        <Dimensions id={id} />
      </Stack>

      <Box display={'flex'} alignItems={'center'}>
        <Settings screen={screen} />
        <Screenshot id={screen.id} />
      </Box>
    </Box>
  )
}

export default Header
