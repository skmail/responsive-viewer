import { useEffect } from 'react'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { removeElement, selectSelectedElementId } from '../../../reducers/draw'

export const useKeyboardShortcuts = () => {
  const selected = useAppSelector(selectSelectedElementId)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = (e.target as HTMLElement).tagName.toLowerCase()

      if (['textarea', 'input'].includes(target)) {
        return
      }

      if (e.code === 'Backspace' || e.code === 'Delete') {
        if (selected) {
          dispatch(removeElement(selected))
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected, dispatch])
}
