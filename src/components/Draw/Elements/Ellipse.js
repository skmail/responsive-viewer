import React from 'react'
import { Ellipse as KonvaEllipse } from 'react-konva'
import { useElement } from '../hooks/useElement'

const Ellipse = ({ element }) => {
  const props = useElement(element)
  return (
    <KonvaEllipse
      {...props}
      x={element.x}
      y={element.y}
      radiusX={element.radiusX}
      radiusY={element.radiusY}
      fill={element.fill}
      shadowBlur={10}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      lineJoin={'round'}
      lineCap={'round'}
    />
  )
}

export default Ellipse
