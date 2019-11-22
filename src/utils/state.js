import storage from './storage'
const STORAGE_KEY = 'APP_STATE'

export const loadState = async () => {
  try {
    const state = await storage.get(STORAGE_KEY)
    if (!state) {
      throw new Error('state not saved')
    }
    return state
  } catch (e) {
    return undefined
  }
}

export const saveState = async state => {
  await storage.set(STORAGE_KEY, state)
}

export const resetState = async state => {
  await storage.remove(STORAGE_KEY)
}
