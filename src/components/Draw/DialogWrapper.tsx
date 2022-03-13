import React, {
  useState,
  useRef,
  useEffect,
  WheelEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Canvas from './Canvas'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectPan, selectSelectedPage } from '../../reducers/draw'

const Root = styled(Box)(({ theme }) => ({
  height: '100%',
  position: 'relative',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}))

const PanArea = styled(Box)(({ theme }) => ({
  inset: 0,
  position: 'absolute',
  cursor: 'grab',
}))

const DialogWrapper = () => {
  const canvasRef = useRef<HTMLDivElement>()

  const [zoom, setZoom] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })

  const pan = useAppSelector(selectPan)
  const { pageWidth, pageHeight } = useAppSelector(state => {
    const page = selectSelectedPage(state)

    return {
      pageWidth: page?.width || 0,
      pageHeight: page?.height || 0,
    }
  })
  const toFixed = (num: number) => parseFloat(num.toFixed(2))
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    const updateSize = () => {
      if (!canvasRef.current) {
        return
      }

      const containerRect = canvasRef.current.getBoundingClientRect()

      setZoom(
        toFixed(
          Math.min(
            Math.min(
              containerRect.width / pageWidth,
              containerRect.height / pageHeight
            ),
            1
          )
        )
      )

      setTranslate({ x: 0, y: 0 })
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [pageWidth, pageHeight])

  const onPan = (event: ReactMouseEvent) => {
    const initial = {
      x: event.pageX,
      y: event.pageY,
    }
    const onDrag = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      const x = event.pageX - initial.x
      const y = event.pageY - initial.y
      initial.x = event.pageX
      initial.y = event.pageY
      setTranslate(translate => ({
        x: translate.x + x,
        y: translate.y + y,
      }))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', onUp)
  }

  const onZoom = (event: WheelEvent) => {
    if (event.deltaY > 0) {
      setZoom(zoom => toFixed(Math.min(zoom + 0.1, 2)))
    } else {
      setZoom(zoom => toFixed(Math.max(0.2, zoom - 0.1)))
    }
  }
  return (
    <Root onWheel={onZoom} ref={canvasRef}>
      <Box
        sx={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
        }}
      >
        <Canvas width={pageWidth} height={pageHeight} zoom={zoom} />
        <div id="canvas-dom-wrapper" />
      </Box>
      {pan && <PanArea onMouseDown={onPan} />}
    </Root>
  )
}

export default DialogWrapper
