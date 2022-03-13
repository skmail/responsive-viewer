import React from 'react'
import { Arrow as KonvaArrow } from 'react-konva'
import { ArrowElement } from '../../../types/draw'
import { useElement } from '../hooks/useElement'

interface Props {
  element: ArrowElement
}
const Arrow = ({ element }: Props) => {
  const props = useElement(element)

  return (
    <KonvaArrow
      {...props}
      points={element.points}
      fill={element.stroke}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      lineJoin={'round'}
      lineCap={'round'}
    />
  )
}

export default Arrow
