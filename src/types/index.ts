export enum ViewMode {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

export enum ScreenDirection {
  portrait = 'portrait',
  landscape = 'landscape',
}

export type Device = {
  id: string
  name: string
  width: number
  height: number
  visible: boolean
  userAgent: string
}

export type UserAgent = {
  name: string
  value: string
}

export type ScreensTab = {
  name: string
  screens: string[]
}

export enum ScreenshotType {
  full = 'full',
  partial = 'partial',
}
