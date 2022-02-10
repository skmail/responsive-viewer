import onDomReady from '../../utils/onDomReady'
import uuid from 'uuid'
import syncScroll from './syncScroll'
import refresh from './refresh'
import dimensions from './dimensions'
import syncClick, { simulateClick, triggerEvent } from './syncClick'

import {
  disableMouseInspector,
  enableMouseInspector,
  scrollToElement,
} from './scrollToElement'

window.frameID = uuid.v4()
onDomReady(() => {
  syncClick()
  refresh()
  window.addEventListener('message', (event: any) => {
    console.log('MESSAGE', event)
    if (!event.data || !String(event.data.message).startsWith('@APP')) {
      return
    }
    console.log(event.data.frameId, window.frameID)
    if (event.data.frameId === window.frameID) {
      return
    }

    console.log('got something')
    switch (event.data.message) {
      case '@APP/FRAME_SCROLL':
        syncScroll(event.data)
        break

      case '@APP/CLICK':
        simulateClick(event.data)
        break

      case '@APP/SCROLL_TO_ELEMENT':
        scrollToElement(event.data)
        break

      case '@APP/ENABLE_MOUSE_INSPECTOR':
        enableMouseInspector()
        break

      case '@APP/DISABLE_MOUSE_INSPECTOR':
        disableMouseInspector()
        break

      case '@APP/DIMENSIONS':
        dimensions(event.data)
        break

      case '@APP/DELEGATE_EVENT':
        triggerEvent(event.data)
        break
      default:
        break
    }
  })
})

chrome.runtime.sendMessage({ message: 'SET_FRAME_ID', frameId: window.frameID })
