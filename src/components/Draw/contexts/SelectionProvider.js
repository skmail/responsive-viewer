import React, { createContext, useContext } from 'react'

const SelectionContext = createContext({})

export const useSelectionContext = () => useContext(SelectionContext)

export const SelectionProvider = ({ children, onSelect, selected }) => {
  return (
    <SelectionContext.Provider
      value={{
        onSelect,
        selected,
      }}
    >
      {children}
    </SelectionContext.Provider>
  )
}
