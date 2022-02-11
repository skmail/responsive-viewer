import React from 'react'
import { styled } from '@mui/material/styles'
import { useAppSelector } from '../hooks/useAppSelector'
import { selectIsTakingScreenshots } from '../reducers/screenshots'

const Root = styled('div')(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  zIndex: 9999,
  cursor: 'none',
}))
const ScreenshotBlocker = () => {
  const is = useAppSelector(selectIsTakingScreenshots)

  if (!is) {
    return null
  }

  return <Root />
}

export default ScreenshotBlocker
