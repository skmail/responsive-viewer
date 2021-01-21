const noobWithCallback = (payload, callback) =>
  setTimeout(() => {
    if (typeof callback === 'function') {
      callback({ test: true })
    }
  }, 300)

export default {
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
  },
}
