import React from 'react'
import { Image as KonvaImage } from 'react-konva'
import useImage from 'use-image'
import { useElement } from '../hooks/useElement'

const Image = ({ element }) => {
  const [image] = useImage(element.src)
  const props = useElement(element)
  return (
    <KonvaImage
      {...props}
      image={image}
      width={element.width}
      height={element.height}
      x={0}
      y={0}
    />
  )
}

export default Image
