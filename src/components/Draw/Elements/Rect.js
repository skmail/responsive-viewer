import React from 'react'
import { Rect as KonvaRect } from 'react-konva'
import { useElement } from '../hooks/useElement'

const Rect = ({ element }) => {
  const props = useElement(element)

  console.log(element)
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
      shadowBlur={10}
      cornerRadius={4}
    />
  )
}

export default Rect
