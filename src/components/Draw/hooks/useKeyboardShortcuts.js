import { useEffect } from 'react'

export const useKeyboardShortcuts = ({ onElementRemove, selected }) => {
  useEffect(() => {
    const onKeyDown = e => {
      const target = e.target.tagName.toLowerCase()

      if (['textarea', 'input'].includes(target)) {
        return
      }
      if (e.code === 'Backspace' || e.code === 'Delete') {
        if (selected) {
          onElementRemove(selected)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected, onElementRemove])
}
