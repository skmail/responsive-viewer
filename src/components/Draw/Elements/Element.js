import React from 'react'
import image from './Image'
import rect from './Rect'
import ellipse from './Ellipse'
import circle from './Circle'
import arrow from './Arrow'
import pen from './Pen'
import text from './Text'

const types = {
  image,
  rect,
  ellipse,
  circle,
  arrow,
  pen,
  text,
}

const Element = ({ element, onChange }) => {
  const ElementType = types[element.type]

  if (!ElementType) {
    return null
  }

  return <ElementType onChange={onChange} element={element} />
}

export default Element
