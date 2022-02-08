import React, { createContext, useContext, useEffect, useRef } from 'react'
import { Transformer as KonvaTransformer } from 'react-konva'

import { useSelectionContext } from './SelectionProvider'
import { useRefContext } from './RefProvider'

const TransformerContext = createContext({})

export const useTransformerContext = () => useContext(TransformerContext)

export const TransformerProvider = ({ children }) => {
  const transformerRef = useRef()
  const { selected } = useSelectionContext()
  const { getRef } = useRefContext()

  useEffect(() => {
    if (!selected) {
      return null
    }

    transformerRef.current.nodes([getRef(selected).current])
    transformerRef.current.getLayer().batchDraw()
  }, [selected])

  return (
    <TransformerContext.Provider value={transformerRef}>
      {children}
      {!!selected && (
        <KonvaTransformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </TransformerContext.Provider>
  )
}
