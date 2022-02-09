import storage from './storage'
const STORAGE_KEY = 'APP_STATE'

export const loadState = async () => {
  try {
    const state = await storage.get(STORAGE_KEY)
    if (!state) {
      return {}
    }
    return state
  } catch (e) {
    return {}
  }
}

export const saveState = async state => {
  await storage.set(STORAGE_KEY, state)
}

export const resetState = async state => {
  await storage.remove(STORAGE_KEY)
}
