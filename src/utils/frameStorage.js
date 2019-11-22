import { isExtension } from './url'

export default {
  frames: {},

  makeFrameId(tabId, frameId) {
    return `${tabId}-${frameId}`
  },
  set(details) {
    this.frames[this.makeFrameId(details.tabId, details.frameId)] = details
  },

  all() {
    return this.frames
  },

  get(tabId, frameId) {
    return this.frames[this.makeFrameId(tabId, frameId)]
  },

  has(tabId, frameId) {
    const id = this.makeFrameId(tabId, frameId)
    return this.frames.hasOwnProperty(id) && this.frames[id] !== null
  },
}
