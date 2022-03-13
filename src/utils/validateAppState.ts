import { Device } from '../types'
import { defaultTabs } from './defaultTabs'
import { State } from '../reducers/app'
const validateScreen = (screen: Device) => {
  if (typeof screen.width !== 'number') {
    throw new Error('Invalid screens')
  }
  if (typeof screen.height !== 'number') {
    throw new Error('Invalid screens')
  }
  if (screen.userAgent && typeof screen.userAgent !== 'string') {
    throw new Error('Invalid screens')
  }
  if (typeof screen.id !== 'string') {
    throw new Error('Invalid screens')
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

  if (typeof config.zoom !== 'number') {
    config.zoom = 1
  }

  return config
}
