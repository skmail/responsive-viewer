import { useEffect } from 'react'
import { Transformer as KonvaTransformer } from 'react-konva'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectSelectedElementId } from '../../reducers/draw'
import { useStageContext } from './contexts/StageProvider'

const Transformer = () => {
  const { getRef, setRef } = useStageContext()

  const selected = useAppSelector(selectSelectedElementId)

  useEffect(() => {
    const transformer = getRef('transformer')
    if (!selected || !transformer) {
      return
    }

    transformer.nodes([getRef(selected).current])
    transformer.getLayer()?.batchDraw()
  }, [selected, getRef])

  if (!selected) {
    return null
  }
  return (
    <KonvaTransformer
      ref={ref => {
        if (ref) {
          setRef('transformer', ref)
        }
      }}
      boundBoxFunc={(oldBox, newBox) => {
        // limit resize
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox
        }
        return newBox
      }}
    />
  )
}

export default Transformer
