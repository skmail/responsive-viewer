import React, {
  createContext,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from 'react'
const RefContext = createContext({})

export const useRefContext = () => useContext(RefContext)

export const RefProvider = ({ children }) => {
  const map = useMemo(() => new Map(), [])

  const refs = useRef(map)

  const getRef = useCallback(id => refs.current.get(id), [])
  const setRef = useCallback((id, ref) => refs.current.set(id, ref), [])

  return (
    <RefContext.Provider
      value={{
        getRef,
        setRef,
      }}
    >
      {children}
    </RefContext.Provider>
  )
}
