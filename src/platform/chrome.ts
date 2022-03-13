///<reference types="chrome"/>

import { Platform } from '../types/platform'

const platform: Platform = {
  storage: {
    local: {
      get: key =>
        new Promise(resolve => {
          window.chrome.storage.local.get(key, result => {
            resolve(result[key])
          })
        }),
      set: items =>
        new Promise(resolve => window.chrome.storage.local.set(items, resolve)),
      remove: keys =>
        new Promise(resolve => {
          window.chrome.storage.local.remove(keys, resolve)
        }),
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
