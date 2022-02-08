import { useEffect, useRef } from 'react'
import { useRefContext } from '../contexts/RefProvider'
import { useSelectionContext } from '../contexts/SelectionProvider'
import { applyStrokeDashArray } from '../utils/stroke'
export const useElement = element => {
  const ref = useRef()

  const { setRef } = useRefContext()

  useEffect(() => {
    setRef(element.id, ref)
  }, [element.id, setRef])

  const { onSelect } = useSelectionContext()

  const select = () => {
    if (!element.locked) {
      onSelect(element.id)
    } else {
      onSelect(null)
    }
  }

  return {
    id: element.id,
    ref,

    onClick: select,
    onTap: select,
    draggable: element.draggable !== false,
    dash: applyStrokeDashArray(element.dash, element.strokeWidth),
  }
}
