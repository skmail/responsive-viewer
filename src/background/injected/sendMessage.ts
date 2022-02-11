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
      message,
      frameId: window.frameID,
    },
    '*'
  )
}
