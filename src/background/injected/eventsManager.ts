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
import { getPrefixedMessage } from '../../utils/getPrefixedMessage'
import platform from '../../platform'

window.frameID = uuid.v4()

onDomReady(() => {
  syncClick()
  onRefresh()

  sendMessage('READY')

  onMessage(data => {
    switch (data.message) {
      case getPrefixedMessage('WHO_ARE_YOU'):
        if (window.frameID === data.fromFrameId) {
          sendMessage('IDENTIFIED', data)
        }
        break
      case getPrefixedMessage('FRAME_SCROLL'):
        syncScroll(data)
        break

      case getPrefixedMessage('CLICK'):
        triggerClickEvent(data)
        break

      case getPrefixedMessage('INSPECT_ELEMENT'):
        inspectByEvent(data)
        break

      case getPrefixedMessage('FINISH_INSPECT_ELEMENT'):
      case getPrefixedMessage('CLEAR_INSPECT_ELEMENT'):
        clearInspector()
        break

      case getPrefixedMessage('ENABLE_MOUSE_INSPECTOR'):
        enableMouseInspector()
        break

      case getPrefixedMessage('DISABLE_MOUSE_INSPECTOR'):
        disableMouseInspector()
        break

      case getPrefixedMessage('DIMENSIONS'):
        dimensions(data)
        break

      case getPrefixedMessage('DELEGATE_EVENT'):
        triggerInputEvent(data)
        break

      case getPrefixedMessage('REFRESH'):
        refresh()
        break

      default:
        break
    }
  })
})

chrome.runtime.sendMessage({
  message: getPrefixedMessage('SET_FRAME_ID'),
  frameId: window.frameID,
})
