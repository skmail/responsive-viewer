import React from 'react'
import { Arrow as KonvaArrow } from 'react-konva'
import { useElement } from '../hooks/useElement'

const Arrow = ({ element }) => {
  const props = useElement(element)

  return (
    <KonvaArrow
      {...props}
      points={element.points}
      shadowBlur={10}
      fill={element.stroke}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      lineJoin={'round'}
      lineCap={'round'}
    />
  )
}

export default Arrow
