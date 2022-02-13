import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import {
  selectDrawingTool,
  setSelectedElement,
  updateElement,
} from '../../../reducers/draw'
import { Element } from '../../../types/draw'
import { useStageContext } from '../contexts/StageProvider'
import { applyStrokeDashArray } from '../utils/stroke'

export function useElement(element: Element) {
  const { setRef } = useStageContext()

  // TODO use correct Typing here
  const ref = useRef<any>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    setRef(element.id, ref)
  }, [element.id, setRef])

  const select = useCallback(() => {
    dispatch(setSelectedElement(element.id))
  }, [element.id, dispatch])

  const drawingTool = useAppSelector(selectDrawingTool)

  const dash = useMemo(
    () => applyStrokeDashArray(element.dash, element.strokeWidth),
    [element.dash, element.strokeWidth]
  )

  const draggable = element.draggable !== false && !drawingTool

  const onUpdate = () => {
    // const stage = getRef('stage')
    // const transformer = getRef('transformer')
    // if (!transformer || !transformer) {
    //   return
    // }
    //save
    // transformerRef.current.hide()
    // const uri = stageRef.current.toDataURL()
    // console.log(uri)
    // transformerRef.current.show()
  }
  return {
    id: element.id,
    ref,
    onClick: select,
    onTap: select,
    draggable,
    dash,
    onDragEnd: () => {
      dispatch(
        updateElement({
          id: element.id,
          props: {
            x: ref.current.x(),
            y: ref.current.y(),
          },
        })
      )
      onUpdate()
    },
    onTransformEnd: () => {
      dispatch(
        updateElement({
          id: element.id,
          props: {
            x: ref.current.x(),
            y: ref.current.y(),
            width: ref.current.width(),
            height: ref.current.height(),
          },
        })
      )
      onUpdate()
    },
  }
}
