import React from 'react'
import { Circle as KonvaCircle } from 'react-konva'
import { useElement } from '../hooks/useElement'

const Circle = ({ element }) => {
  const props = useElement(element)
  return (
    <KonvaCircle
      {...props}
      x={element.x}
      y={element.y}
      radius={element.radius}
      fill={element.fill}
      shadowBlur={10}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      lineJoin={'round'}
      lineCap={'round'}
    />
  )
}

export default Circle
