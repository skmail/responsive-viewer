import { useEffect, useState } from 'react'
import { tools } from '../tools'
export const useDrawingElement = (
  stage,
  { activeTool, onFinish, latestStyles }
) => {
  useEffect(() => {
    if (!activeTool) {
      return
    }

    const stageInstance = stage.current

    const onDown = event => {
      event.stopPropagation()

      const tool = new tools[activeTool](
        {
          tool: activeTool,
          x: event.layerX,
          y: event.layerY,
          latestStyles: latestStyles.current,
        },

        stage.current
      )

      const stageBox = stage.current.content.getBoundingClientRect()

      const onMove = e => {
        tool.move({
          x: e.pageX - stageBox.x,
          y: e.pageY - stageBox.y,
        })
      }
      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)

        const result = tool.finished()

        if (result) {
          onFinish(result)
        }
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    }

    stageInstance.addEventListener('mousedown', onDown)

    return () => {
      stageInstance.removeEventListener('mousedown', onDown)
    }
  }, [activeTool, onFinish, stage])
}
