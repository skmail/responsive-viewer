import React, { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Canvas from './Canvas'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectSelectedPage } from '../../reducers/draw'

const Root = styled(Box)(({ theme }) => ({
  height: '100%',
  position: 'relative',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}))

const DialogWrapper = () => {
  const canvasRef = useRef<HTMLDivElement>()

  const [scale, setScale] = useState(1)
  const [zoom, setZoom] = useState(0)

  const { pageWidth, pageHeight } = useAppSelector(state => {
    const page = selectSelectedPage(state)

    return {
      pageWidth: page?.width || 0,
      pageHeight: page?.height || 0,
    }
  })
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    const updateSize = () => {
      if (!canvasRef.current) {
        return
      }

      const containerRect = canvasRef.current.getBoundingClientRect()

      setScale(
        Math.min(
          Math.min(
            containerRect.width / pageWidth,
            containerRect.height / pageHeight
          ),
          1
        )
      )
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [pageWidth, pageHeight])

  return (
    <Root ref={canvasRef}>
      <Box
        sx={{
          transform: `scale(${scale})`,
        }}
      >
        <Canvas width={pageWidth} height={pageHeight} />
      </Box>

      <div id="canvas-dom-wrapper" />
    </Root>
  )
}

export default DialogWrapper
