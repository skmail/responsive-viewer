import { createPortal } from 'react-dom'
import { styled } from '@mui/material/styles'
import { Device } from '../../types'
import { useState, MouseEvent as ReactMouseEvent } from 'react'
import { useAppSelector } from '../../hooks/useAppSelector'
import {
  selectZoom,
  saveScreen,
  selectScreenDirection,
} from '../../reducers/app'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { getDimensionNameForScreenDirection } from '../../saga/getDimensionNameForScreenDirection'

enum ResizeHandleType {
  X,
  Y,
  DIAGONAL,
}

const cursor = {
  [ResizeHandleType.X]: 'e-resize',
  [ResizeHandleType.Y]: 's-resize',
  [ResizeHandleType.DIAGONAL]: 'se-resize',
}
const HandleIcon = styled('svg')<{ active?: boolean }>(({ theme, active }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 20,
  height: 20,
  background: active ? theme.palette.primary.main : theme.palette.grey[800],
  borderRadius: 5,
  padding: 2,
  '&:hover': {
    background: theme.palette.primary.main,
  },
}))

const ResizeHandle = styled('div')<{ active?: boolean }>(({ active }) => ({
  opacity: active ? 1 : 0,

  '&:hover': {
    opacity: 1,
  },
}))
const XResizeHandle = styled(ResizeHandle)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 'calc(100% + 2px)',

  height: '100%',
  width: 20,
  cursor: cursor[ResizeHandleType.X],

  '&:before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 1,

    height: '100%',
    top: 0,
    background: theme.palette.grey[800],
  },
}))

const YResizeHandle = styled(ResizeHandle)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 'calc(100% + 2px)',
  width: '100%',
  height: 20,
  cursor: cursor[ResizeHandleType.Y],
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    height: 1,

    width: '100%',
    left: 0,
    background: theme.palette.grey[800],
  },
}))
const DiagonalResizeHandle = styled(ResizeHandle)(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% + 2px)',
  left: 'calc(100% + 2px)',
  width: 20,
  height: 20,
  cursor: cursor[ResizeHandleType.DIAGONAL],
}))

const DragOverlay = styled('div')(({ theme }) => ({
  position: 'fixed',
  inset: 0,
}))

export function ResizeHandles({ screen }: { screen: Device }) {
  const screenDirection = useAppSelector(selectScreenDirection)

  const [resizeHandle, setResizeHandle] = useState<ResizeHandleType>()

  const zoom = useAppSelector(selectZoom)

  const dispatch = useAppDispatch()

  const onResize = (
    e: ReactMouseEvent,
    callback: (data: { x: number; y: number }) => Partial<Device>,
    resizeHandleType: ResizeHandleType
  ) => {
    e.preventDefault()
    let x = e.clientX
    let y = e.clientY
    setResizeHandle(resizeHandleType)

    const onDrag = (e: MouseEvent) => {
      let noudge = e.shiftKey ? 15 : 1
      let movedX = Math.round((e.clientX - x) / noudge) * noudge
      let movedY = Math.round((e.clientY - y) / noudge) * noudge

      dispatch(
        saveScreen({
          ...screen,
          originalSize: screen.originalSize || [screen.width, screen.height],
          ...callback({
            x: movedX / zoom,
            y: movedY / zoom,
          }),
        })
      )
    }
    const onUp = () => {
      setResizeHandle(undefined)
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <>
      <XResizeHandle
        active={resizeHandle !== undefined}
        onMouseDown={e =>
          onResize(
            e,
            ({ x }) => ({
              [getDimensionNameForScreenDirection(
                screenDirection,
                'width'
              )]: Math.round(
                Math.max(
                  screen[
                    getDimensionNameForScreenDirection(screenDirection, 'width')
                  ] + x,
                  2
                )
              ),
            }),
            ResizeHandleType.X
          )
        }
      >
        <HandleIcon active={resizeHandle === ResizeHandleType.X}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3m0 0 3.75 3.75M3 12l3.75-3.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </HandleIcon>
      </XResizeHandle>

      <YResizeHandle
        active={resizeHandle !== undefined}
        onMouseDown={e =>
          onResize(
            e,
            ({ y }) => ({
              [getDimensionNameForScreenDirection(
                screenDirection,
                'height'
              )]: Math.round(
                Math.max(
                  screen[
                    getDimensionNameForScreenDirection(
                      screenDirection,
                      'height'
                    )
                  ] + y,
                  2
                )
              ),
            }),
            ResizeHandleType.Y
          )
        }
      >
        <HandleIcon active={resizeHandle === ResizeHandleType.Y}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.75 17.25L12 21M12 21L8.25 17.25M12 21V3M12 3L8.25 6.75M12 3L15.75 6.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </HandleIcon>
      </YResizeHandle>

      <DiagonalResizeHandle
        active={resizeHandle !== undefined}
        onMouseDown={e =>
          onResize(
            e,
            ({ y, x }) => ({
              [getDimensionNameForScreenDirection(
                screenDirection,
                'height'
              )]: Math.round(
                Math.max(
                  screen[
                    getDimensionNameForScreenDirection(
                      screenDirection,
                      'height'
                    )
                  ] + y,
                  2
                )
              ),
              [getDimensionNameForScreenDirection(
                screenDirection,
                'width'
              )]: Math.round(
                Math.max(
                  screen[
                    getDimensionNameForScreenDirection(screenDirection, 'width')
                  ] + x,
                  2
                )
              ),
            }),
            ResizeHandleType.DIAGONAL
          )
        }
      >
        <HandleIcon active={resizeHandle === ResizeHandleType.DIAGONAL}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.364 13.0607V18.364M18.364 18.364H13.0607M18.364 18.364L5.63604 5.63604M5.63604 5.63604V10.9393M5.63604 5.63604H10.9393"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </HandleIcon>
      </DiagonalResizeHandle>

      {resizeHandle !== undefined &&
        createPortal(
          <DragOverlay
            sx={{
              cursor: cursor[resizeHandle],
            }}
          />,
          document.body
        )}
    </>
  )
}
