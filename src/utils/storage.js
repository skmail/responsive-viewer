const storage = window.chrome.storage.local

export default {
  get(key) {
    return new Promise(resolve => {
      storage.get(key, value =>
        resolve(value[key] ? JSON.parse(value[key]) : undefined)
      )
    })
  },

  set(key, value) {
    return new Promise(resolve => {
      storage.set({ [key]: JSON.stringify(value) }, result => {
        resolve(result)
      })
    })
  },
}
