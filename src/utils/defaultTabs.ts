import devices from '../data/devices'
import { Device } from '../types'

export const defaultTabs = () => [
  {
    name: 'default',
    screens: devices.reduce((acc: string[], device: Device) => {
      if (device.visible) {
        acc.push(device.id)
      }
      return acc
    }, []),
  },
  {
    name: 'mobile',
    screens: [],
  },
  {
    name: 'tablet',
    screens: [],
  },
  {
    name: 'desktop',
    screens: [],
  },
]
