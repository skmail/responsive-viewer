import React from 'react'
import { Image as KonvaImage } from 'react-konva'
import useImage from 'use-image'
import { useElement } from '../hooks/useElement'
import { ImageElement } from '../../../types/draw'

interface Props {
  element: ImageElement
}

const Image = ({ element }: Props) => {
  const [image] = useImage(element.src)
  const props = useElement(element)

  return (
    <KonvaImage
      {...props}
      image={image}
      width={element.width}
      height={element.height}
      x={element.x}
      y={element.y}
    />
  )
}

export default Image
