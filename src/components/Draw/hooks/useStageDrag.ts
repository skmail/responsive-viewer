import Konva from 'konva'
import { useRef } from 'react'

export const useStageDrag = () => {
  const ref = useRef<Konva.Stage>(null)

  return [ref]
}
