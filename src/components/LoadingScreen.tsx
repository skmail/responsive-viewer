import React from 'react'
import { styled } from '@mui/material/styles'
import AppLogo from './AppLogo'
import Typography from '@mui/material/Typography'
import { keyframes } from '@mui/system'

const fadeIn = keyframes` 
    0% { opacity: 0; transform: translateX(100px); }  
    100%   { opacity: 1; transform: translateX(0); } 
`

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(4, 8),
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
}))
const Logo = styled(AppLogo)(({ theme }) => ({
  width: 200,

  opacity: 0,
  animationName: fadeIn,
  animationDuration: '3s',
  animationDelay: '0.2s',
  animationFillMode: 'forwards',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    width: 150,
  },

  [theme.breakpoints.down('sm')]: {
    width: 100,
  },
}))
const Title = styled(Typography)(({ theme }) => ({
  height: 100,
  opacity: 0,
  animationName: fadeIn,
  animationDuration: '3s',
  animationDelay: '0.4s',
  animationFillMode: 'forwards',
  [theme.breakpoints.down('lg')]: {
    fontSize: 70,
  },
  [theme.breakpoints.down('md')]: {
    fontSize: 50,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 30,
  },
}))
const LoadingScreen = () => {
  return (
    <Root>
      <Logo />

      <Title variant="h1">Responsive Viewer</Title>
    </Root>
  )
}

export default LoadingScreen
