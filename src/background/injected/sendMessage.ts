import { getPrefixedMessage } from '../../utils/getPrefixedMessage'

export const sendMessage = (
  message: string,
  data: { [key: string]: any } = {}
) => {
  if (!window.top) {
    return
  }
  window.top.postMessage(
    {
      ...data,
      message: getPrefixedMessage(message),
      frameId: window.frameID,
    },
    '*'
  )
}
