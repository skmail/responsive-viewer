export default {
  storage: {
    local: {
      get: (...args) => window.browser.storage.local.get(...args),
      set: (...args) => window.browser.storage.local.set(...args),
      remove: (...args) => window.browser.storage.local.remove(...args),
    },
  },
  runtime: {
    sendMessage: (...args) => window.browser.runtime.sendMessage(...args),
    getURL: (...args) => window.browser.runtime.getURL(...args),
    onMessage: {
      addListener: (...args) =>
        window.browser.runtime.onMessage.addListener(...args),
    },
  },
}
