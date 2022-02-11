import onDomReady from '../../utils/onDomReady'
import uuid from 'uuid'
import syncScroll from './syncScroll'
import { onRefresh, refresh } from './refresh'
import dimensions from './dimensions'
import syncClick, { triggerClickEvent, triggerInputEvent } from './syncClick'
import {
  clearInspector,
  disableMouseInspector,
  enableMouseInspector,
  inspectByEvent,
} from './inspectElement'
import { sendMessage } from './sendMessage'
import { onMessage } from './onMessage'

window.frameID = uuid.v4()

onDomReady(() => {
  syncClick()
  onRefresh()

  sendMessage('@APP/READY')

  onMessage(data => {
    if (!data || !String(data.message).startsWith('@APP')) {
      return
    }

    if (data.frameId === window.frameID) {
      return
    }

    switch (data.message) {
      case '@APP/WHO_ARE_YOU':
        if (window.frameID === data.fromFrameId) {
          sendMessage('@APP/IDENTIFIED', data)
        }
        break
      case '@APP/FRAME_SCROLL':
        syncScroll(data)
        break

      case '@APP/CLICK':
        triggerClickEvent(data)
        break

      case '@APP/INSPECT_ELEMENT':
        inspectByEvent(data)
        break

      case '@APP/FINISH_INSPECT_ELEMENT':
      case '@APP/CLEAR_INSPECT_ELEMENT':
        clearInspector()
        break

      case '@APP/ENABLE_MOUSE_INSPECTOR':
        enableMouseInspector()
        break

      case '@APP/DISABLE_MOUSE_INSPECTOR':
        disableMouseInspector()
        break

      case '@APP/DIMENSIONS':
        dimensions(data)
        break

      case '@APP/DELEGATE_EVENT':
        triggerInputEvent(data)
        break

      case '@APP/REFRESH':
        refresh()
        break

      default:
        break
    }
  })
})

chrome.runtime.sendMessage({ message: 'SET_FRAME_ID', frameId: window.frameID })
