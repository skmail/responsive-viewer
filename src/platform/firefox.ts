// @ts-nocheck

import { Platform } from '../types'

const platform: Platform = {
  storage: {
    local: {
      get: (...args) => window.browser.storage.local.get(...args),
      set: items => window.browser.storage.local.set(items),
      remove: keys => window.browser.storage.local.remove(keys),
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
