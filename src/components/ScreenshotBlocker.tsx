import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useAppSelector } from '../hooks/useAppSelector'
import { screenshot, selectIsTakingScreenshots } from '../reducers/screenshots'
import { useAppDispatch } from '../hooks/useAppDispatch'

const Root = styled('div')(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  zIndex: 9999,
  cursor: 'none',
}))
const ScreenshotBlocker = () => {
  const isRunning = useAppSelector(selectIsTakingScreenshots)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // if (!isRunning) {
    //   return
    // }
    const onCancel = (event: KeyboardEvent) => {
      if (event.code !== 'Escape') {
        return
      }

      dispatch(
        screenshot({
          screens: [],
          cancel: true,
        })
      )
    }
    window.addEventListener('keydown', onCancel)

    return () => {
      window.removeEventListener('keydown', onCancel)
    }
  }, [isRunning, dispatch])
  if (!isRunning) {
    return null
  }

  return <Root />
}

export default ScreenshotBlocker
