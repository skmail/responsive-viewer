import React from 'react'
import { Line as KonvaLine } from 'react-konva'
import { PenElement } from '../../../types/draw'
import { useElement } from '../hooks/useElement'

interface Props {
  element: PenElement
}

const Pen = ({ element }: Props) => {
  const props = useElement(element)

  return (
    <KonvaLine
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

export default Pen
