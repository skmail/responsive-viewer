import storage from './storage'
export const loadState = () => {
  try {
    const state = storage.get('appState')
    if (!state) {
      throw new Error('state not saved')
    }
    return state
  } catch (e) {
    return undefined
  }
}

export const saveState = state => {
  storage.set('appState', state)
}
