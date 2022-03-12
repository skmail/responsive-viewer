import React, { useEffect } from 'react'
import { Stage, Layer } from 'react-konva'
import Element from './Elements/Element'
import { useStageDrag } from './hooks/useStageDrag'
import { useDrawingTool } from './hooks/useDrawingTool'

import { StageProvider } from './contexts/StageProvider'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

import { useAppSelector } from '../../hooks/useAppSelector'
import { selectPageElementIds } from '../../reducers/draw'
import { Provider } from 'react-redux'
import store from '../../store'
import Transformer from './Transformer'

interface Props {
  width: number
  height: number
  zoom?: number
}
const Canvas = ({ width, height, zoom = 1 }: Props) => {
  const [stageRef] = useStageDrag()

  useDrawingTool(stageRef, zoom)

  useKeyboardShortcuts()

  const elementIds = useAppSelector(selectPageElementIds)

  return (
    <Stage ref={stageRef} width={width} height={height}>
      <Provider store={store}>
        <Layer>
          <StageProvider stageRef={stageRef}>
            {elementIds.map(id => (
              <Element key={id} id={id} />
            ))}
            <Transformer />
          </StageProvider>
        </Layer>
      </Provider>
    </Stage>
  )
}

export default Canvas
