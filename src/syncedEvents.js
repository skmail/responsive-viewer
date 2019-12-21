import onDomReady from './utils/onDomReady'
import uuid from 'uuid'
import './inject/utils'
import scrollTo from './inject/scrollTo'
import syncClick, { simulateClick } from './inject/syncClick'
import {
  disableMouseInspector,
  enableMouseInspector,
  scrollToElement,
} from './inject/scrollToElement'
import screenshot, { screenshotDone } from './inject/screenshot'

window.frameID = uuid.v4()

onDomReady(() => {
  syncClick()

  window.addEventListener('message', event => {
    if (!event.data || !String(event.data.message).startsWith('@APP')) {
      return
    }

    if (event.data.frameId === window.frameID) {
      return
    }

    switch (event.data.message) {
      case '@APP/FRAME_SCROLL':
        scrollTo(event.data)
        break

      case '@APP/CLICK':
        simulateClick(event.data)
        break

      case '@APP/SCROLL_TO_ELEMENT':
        scrollToElement(event.data)
        break

      case '@APP/ENABLE_MOUSE_INSPECTOR':
        enableMouseInspector(event.data)
        break

      case '@APP/DISABLE_MOUSE_INSPECTOR':
        disableMouseInspector(event.data)
        break

      case '@APP/SCREENSHOT':
        screenshot(event.data)
        break
      case '@APP/SCREENSHOT_DONE':
        screenshotDone(event.data)
        break
    }
  })
})
