import { Platform } from '../types'

const noobWithCallback = (payload: any, callback: (response: any) => void) =>
  setTimeout(() => {
    if (typeof callback === 'function') {
      callback({})
    }
  }, 300)

const platform: Platform = {
  storage: {
    local: {
      get: noobWithCallback,
      set: noobWithCallback,
      remove: noobWithCallback,
    },
  },
  runtime: {
    sendMessage: noobWithCallback,
    getURL: () => '/local',
    onMessage: {
      addListener: noobWithCallback,
    },
  },
}

export default platform
