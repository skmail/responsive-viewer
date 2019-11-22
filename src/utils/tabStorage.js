import { isExtension } from './url'

export default {
  tabs: {},

  set(tabId, details) {
    this.tabs[tabId] = details
  },

  all() {
    return this.tabs
  },

  get(tabId) {
    return this.tabs[tabId]
  },

  has(tabId) {
    return this.tabs.hasOwnProperty(tabId) && this.tabs[tabId] !== null
  },

  isExtension(tabId) {
    const tab = this.get(tabId)
    if (!tab) {
      return false
    }
    return isExtension(this.get(tabId).url)
  },

  remove(tabId) {
    this.tabs[tabId] = null
  },
}
