import Konva from 'konva'
import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
  RefObject,
  useEffect,
} from 'react'

interface StageContextInterface {
  getRef: GetRef<any>
  setRef: SetRef<any>
}
type GetRef<T> = (id: string) => T
type SetRef<T> = (id: string, ref: T) => T

const StageContext = createContext<StageContextInterface>({
  getRef: () => null,
  setRef: (id, ref) => ref,
})

export const useStageContext = () => useContext(StageContext)

interface Props {
  children: ReactNode
  stageRef?: RefObject<Konva.Stage>
}

const store = new Map()

export const StageProvider = ({ children, stageRef }: Props) => {
  const getRef: GetRef<any> = useCallback(id => store.get(id), [])
  const setRef: SetRef<any> = useCallback((id, ref) => {
    store.set(id, ref)
    return ref
  }, [])

  useEffect(() => {
    if (stageRef && stageRef.current) {
      setRef('stage', stageRef.current)
    }
  }, [setRef, stageRef])

  return (
    <StageContext.Provider
      value={{
        getRef,
        setRef,
      }}
    >
      {children}
    </StageContext.Provider>
  )
}
