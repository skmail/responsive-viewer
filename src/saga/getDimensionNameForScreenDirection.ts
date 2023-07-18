import { ScreenDirection } from '../types'

export const getDimensionNameForScreenDirection = (
  screenDirection: ScreenDirection,
  field: 'width' | 'height'
) => {
  if (field === 'width') {
    return screenDirection === 'landscape' ? 'height' : 'width'
  }
  return screenDirection === 'landscape' ? 'width' : 'height'
}
