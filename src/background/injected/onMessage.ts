export const onMessage = (callback: (data: any) => void) => {
  const onMessage = (event: { data: any }) => {
    if (!event.data || !String(event.data.message).startsWith('@APP')) {
      return
    }

    if (event.data.frameId === window.frameID) {
      return
    }

    callback(event.data)
  }

  window.addEventListener('message', onMessage)

  return () => {
    window.removeEventListener('message', onMessage)
  }
}
