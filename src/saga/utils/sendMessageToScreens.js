import { getIframeId } from '../../utils/screen'

export const sendMessageToScreens = (screens, message, delay = 0) => {
  const send = () => {
    screens = screens.filter(screen => screen.visible)
    let counter = 0

    while (counter < screens.length) {
      const screen = screens[counter]
      const iframeId = getIframeId(screen.id)
      const element = document.getElementById(iframeId)
      element.contentWindow.postMessage(
        {
          screen,
          ...message,
        },
        '*'
      )
      counter++
    }
  }

  delay ? setTimeout(send, delay) : send()
}
