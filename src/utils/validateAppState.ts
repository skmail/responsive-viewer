import { Device } from '../types'
import { defaultTabs } from './defaultTabs'
import { State } from '../reducers/app'
const isNumber = (value: any) => {
  return /^-?[0-9]+$/.test(value)
}
const validateScreen = (screen: Device) => {
  if (!isNumber(screen.width)) {
    throw new Error('Invalid screen width')
  }
  if (!isNumber(screen.height)) {
    throw new Error('Invalid screen height')
  }
  if (screen.userAgent && typeof screen.userAgent !== 'string') {
    throw new Error('Invalid user agents')
  }
  if (typeof screen.id !== 'string') {
    throw new Error('Invalid screen id')
  }
}

export const validateAppState = (config: Partial<State>) => {
  if (!config.screens) {
    throw new Error('Invalid screens')
  }

  for (let screen of config.screens) {
    validateScreen(screen)
  }

  if (!config.userAgents) {
    throw new Error('Invalid userAgents')
  }

  if (!config.tabs) {
    config.tab = 'default'

    const tabs = defaultTabs()

    tabs[0].screens = config.screens.reduce((acc: string[], device: Device) => {
      if (device.visible) {
        acc.push(device.id)
      }
      return acc
    }, [])

    config.tabs = tabs
  }

  for (let screen of config.userAgents) {
    if (typeof screen.name !== 'string') {
      throw new Error('Invalid userAgents')
    }
    if (typeof screen.value !== 'string') {
      throw new Error('Invalid userAgents')
    }
  }

  if (!config.zoom) {
    config.zoom = 1
  }

  return config
}
