import { useEffect, useRef } from 'react'

export const useStageDrag = () => {
  const ref = useRef()

  useEffect(() => {
    console.log(ref)
  }, [])

  return [ref]
}
