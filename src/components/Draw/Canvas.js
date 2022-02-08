import React from 'react'
import { Stage, Layer } from 'react-konva'
import Element from './Elements/Element'
import { useStageDrag } from './hooks/useStageDrag'
import { useDrawingElement } from './hooks/useDrawingElement'

import { RefProvider } from './contexts/RefProvider'
import { SelectionProvider } from './contexts/SelectionProvider'
import { TransformerProvider } from './contexts/TransformerProvider'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
const Canvas = ({
  width,
  height,
  activeTool,
  elements,
  addElement,
  onSelect,
  selected,
  latestStyles,
  onElementUpdate,
  onElementRemove,
}) => {
  const [stageRef] = useStageDrag()

  useDrawingElement(stageRef, {
    activeTool,
    onFinish: addElement,
    latestStyles,
  })

  useKeyboardShortcuts({ onElementRemove, selected })

  return (
    <Stage ref={stageRef} width={width} height={height}>
      <Layer>
        <SelectionProvider onSelect={onSelect} selected={selected}>
          <RefProvider>
            <TransformerProvider>
              {elements.map(element => (
                <Element
                  onChange={data => onElementUpdate(element.id, data)}
                  key={element.id}
                  element={element}
                />
              ))}
            </TransformerProvider>
          </RefProvider>
        </SelectionProvider>
      </Layer>
    </Stage>
  )
}

export default Canvas
