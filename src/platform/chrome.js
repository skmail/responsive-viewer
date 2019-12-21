export default {
  storage: {
    local: {
      get: (...args) => window.chrome.storage.local.get(...args),
      set: (...args) => window.chrome.storage.local.set(...args),
      remove: (...args) => window.chrome.storage.local.remove(...args),
    },
  },
  runtime: {
    sendMessage: (...args) => window.chrome.runtime.sendMessage(...args),
    getURL: (...args) => window.chrome.runtime.getURL(...args),
  },
}
