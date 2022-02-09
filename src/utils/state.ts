import platform from '../platform'
import { State } from '../reducers/app'

const STORAGE_KEY = 'APP_STATE'

export const loadState = async () => {
  try {
    const state = await platform.storage.local.get(STORAGE_KEY)
    if (!state) {
      return {}
    }
    return state
  } catch (e) {
    return {}
  }
}

export const saveState = async (state: State) => {
  await platform.storage.local.set({
    [STORAGE_KEY]: state,
  })
}

export const resetState = async () => {
  await platform.storage.local.remove(STORAGE_KEY)
}
