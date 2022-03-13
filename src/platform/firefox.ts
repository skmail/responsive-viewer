// @ts-nocheck

import { Platform } from '../types/platform'

const platform: Platform = {
  storage: {
    local: {
      get: key =>
        new Promise(resolve => {
          window.browser.storage.local.get(key, resolve)
        }),
      set: items =>
        new Promise(resolve =>
          window.browser.storage.local.set(items, resolve)
        ),
      remove: keys =>
        new Promise(resolve => {
          window.browser.storage.local.remove(keys, resolve)
        }),
    },
  },
  runtime: {
    sendMessage: (message: any, responseCallback: (response: any) => void) =>
      window.browser.runtime.sendMessage(message, responseCallback),
    getURL: (path: string) => window.browser.runtime.getURL(path),
    onMessage: {
      addListener: (callback: any) =>
        window.browser.runtime.onMessage.addListener(callback),
    },
  },
}

export default platform
