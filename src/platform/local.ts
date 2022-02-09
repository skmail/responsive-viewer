import { Platform } from '../types/platform'

const noobWithCallback = (payload: any, callback: (response: any) => void) => {}

const platform: Platform = {
  storage: {
    local: {
      get: key =>
        new Promise(resolve => {
          let result = window.localStorage.getItem(key)
          try {
            if (result) {
              result = JSON.parse(result)
            }
          } catch (error) {}
          resolve(result)
        }),
      set: values =>
        new Promise(resolve => {
          Object.entries(values).forEach(([key, value]) => {
            if (value && (Array.isArray(value) || typeof value === 'object')) {
              value = JSON.stringify(value)
            }
            window.localStorage.setItem(key, value)
          })
          resolve()
        }),
      remove: key =>
        new Promise(resolve => {
          window.localStorage.removeItem(key)
          resolve()
        }),
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
