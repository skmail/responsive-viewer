import React from 'react'
import { Line as KonvaLine } from 'react-konva'
import { useElement } from '../hooks/useElement'

const Pen = ({ element }) => {
  const props = useElement(element)

  return (
    <KonvaLine
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

export default Pen
