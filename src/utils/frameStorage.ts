import { isExtension } from './url'

interface Detail {
  tabId: string
  frameId: string
}
export default {
  frames: {} as { [key: string]: Detail },

  makeFrameId(tabId: string, frameId: string) {
    return `${tabId}-${frameId}`
  },
  set(details: Detail) {
    this.frames[this.makeFrameId(details.tabId, details.frameId)] = details
  },

  all() {
    return this.frames
  },

  get(tabId: string, frameId: string) {
    return this.frames[this.makeFrameId(tabId, frameId)]
  },

  has(tabId: string, frameId: string) {
    const id = this.makeFrameId(tabId, frameId)
    return this.frames.hasOwnProperty(id) && this.frames[id] !== null
  },
}
