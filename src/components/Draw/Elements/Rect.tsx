import React from 'react'
import { Rect as KonvaRect } from 'react-konva'
import { useElement } from '../hooks/useElement'
import { RectElement } from '../../../types/draw'

interface Props {
  element: RectElement
}
const Rect = ({ element }: Props) => {
  const props = useElement(element)

  return (
    <KonvaRect
      {...props}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      lineJoin={'round'}
      lineCap={'round'}
    />
  )
}

export default Rect
