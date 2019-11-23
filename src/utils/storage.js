import platform from '../platform'
const storage = platform.storage.local

export default {
  get(key) {
    return new Promise(resolve => {
      storage.get(key, value => resolve(value[key] ? value[key] : undefined))
    })
  },

  set(key, value) {
    return new Promise(resolve => {
      try {
        storage.set({ [key]: value }, result => {
          resolve(result)
        })
      } catch (error) {
        console.log('error', error)
      }
    })
  },

  remove(key) {
    return new Promise(resolve => {
      storage.remove(key, result => {
        resolve(result)
      })
    })
  },
}
