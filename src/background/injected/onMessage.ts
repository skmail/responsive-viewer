import { getPrefixedMessage } from '../../utils/getPrefixedMessage'

export const onMessage = (callback: (data: any) => void) => {
  const onMessage = (event: { data: any }) => {
    if (
      !event.data ||
      !String(event.data.message).startsWith(getPrefixedMessage())
    ) {
      return
    }

    if (event.data.screenId === window.screenId) {
      return
    }

    callback(event.data)
  }

  window.addEventListener('message', onMessage)

  return () => {
    window.removeEventListener('message', onMessage)
  }
}
