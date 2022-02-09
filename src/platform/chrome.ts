///<reference types="chrome"/>

import { Platform } from '../types'

const platform: Platform = {
  storage: {
    local: {
      get: (...args) => window.chrome.storage.local.get(...args),
      set: items => window.chrome.storage.local.set(items),
      remove: keys => window.chrome.storage.local.remove(keys),
    },
  },
  runtime: {
    sendMessage: (message: any, responseCallback: (response: any) => void) =>
      window.chrome.runtime.sendMessage(message, responseCallback),
    getURL: (path: string) => window.chrome.runtime.getURL(path),
    onMessage: {
      addListener: (callback: any) =>
        window.chrome.runtime.onMessage.addListener(callback),
    },
  },
}

export default platform
