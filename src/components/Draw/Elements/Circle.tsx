import React from 'react'
import { Circle as KonvaCircle } from 'react-konva'
import { CircleElement } from '../../../types/draw'
import { useElement } from '../hooks/useElement'
interface Props {
  element: CircleElement
}
const Circle = ({ element }: Props) => {
  const props = useElement(element)
  return (
    <KonvaCircle
      {...props}
      x={element.x}
      y={element.y}
      radius={element.radius}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      lineJoin={'round'}
      lineCap={'round'}
    />
  )
}

export default Circle
