import Konva from 'konva'
import { RefObject, useEffect, useRef } from 'react'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import {
  addElement,
  selectDrawingTool,
  selectLatestStyles,
} from '../../../reducers/draw'
import { Element } from '../../../types/draw'
import { tools } from '../tools'
export function useDrawingTool(stageRef: RefObject<Konva.Stage>, zoom = 1) {
  const drawingTool = useAppSelector(selectDrawingTool)
  const dispatch = useAppDispatch()
  const latestStyles = useRef<Partial<Element>>({})

  useAppSelector(state => {
    latestStyles.current = selectLatestStyles(state)
  })

  useEffect(() => {
    if (!drawingTool || !stageRef.current) {
      return
    }

    const stage = stageRef.current

    const onDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
      event.evt.stopPropagation()
      const stageBox = stage.content.getBoundingClientRect()

      const tool = new tools[drawingTool](
        {
          tool: drawingTool,
          x: (event.evt.pageX - stageBox.x) / zoom,
          y: (event.evt.pageY - stageBox.y) / zoom,
          latestStyles: latestStyles.current,
        },

        stage
      )

      const onMove = (event: MouseEvent) => {
        tool.move({
          x: (event.pageX - stageBox.x) / zoom,
          y: (event.pageY - stageBox.y) / zoom,
        })
      }
      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        const result = tool.finished()
        if (result) {
          dispatch(addElement(result as Element))
        }
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    }

    stage.on('mousedown', onDown)

    return () => {
      stage.off('mousedown')
    }
  }, [drawingTool, dispatch, stageRef, zoom])
}
