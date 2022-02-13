import React from 'react'
import { Ellipse as KonvaEllipse } from 'react-konva'
import { useElement } from '../hooks/useElement'
import { EllipseElement } from '../../../types/draw'
interface Props {
  element: EllipseElement
}
const Ellipse = ({ element }: Props) => {
  const props = useElement(element)
  return (
    <KonvaEllipse
      {...props}
      x={element.x}
      y={element.y}
      radiusX={element.radiusX}
      radiusY={element.radiusY}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      lineJoin={'round'}
      lineCap={'round'}
    />
  )
}

export default Ellipse
