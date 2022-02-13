import React from 'react'
import image from './Image'
import rect from './Rect'
import ellipse from './Ellipse'
import circle from './Circle'
import arrow from './Arrow'
import pen from './Pen'
import text from './Text'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { selectElementById } from '../../../reducers/draw'
const types = {
  image,
  rect,
  ellipse,
  circle,
  arrow,
  pen,
  text,
}
interface Props {
  id: string
}

const Element = ({ id }: Props) => {
  const element = useAppSelector(state => selectElementById(state, id))

  if (!element) {
    return null
  }

  const ElementType = types[element.type]

  if (!ElementType) {
    return null
  }
  // TODO - handle ts-ignore
  // @ts-ignore
  return <ElementType element={element} />
}

export default Element
