import { Device } from '../../types'
import { getPrefixedMessage } from '../../utils/getPrefixedMessage'
import { getIframeId } from '../../utils/screen'

export const sendMessageToScreens = (
  screens: Device[],
  message: { [key: string]: any },
  delay = 0,
  forwarded = false
) => {
  const send = () => {
    for (let screen of screens) {
      const iframeId = getIframeId(screen.id)
      const element = document.getElementById(iframeId) as HTMLIFrameElement

      if (!element || !element.contentWindow) {
        continue
      }

      element.contentWindow.postMessage(
        {
          screen,
          ...message,
          message: forwarded
            ? message.message
            : getPrefixedMessage(message.message),
        },
        '*'
      )
    }
  }

  delay ? setTimeout(send, delay) : send()
}
