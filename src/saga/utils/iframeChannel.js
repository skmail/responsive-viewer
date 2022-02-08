import { END, eventChannel } from 'redux-saga'

export const iframeChannel = (name = '@APP/', stopOnFirstMessage = false) =>
  eventChannel(emitter => {
    const onMessage = event => {
      if (!event.data || !String(event.data.message).startsWith(name)) {
        return
      }

      emitter(event.data)

      if (stopOnFirstMessage) {
        emitter(END)
      }
    }

    window.addEventListener('message', onMessage)

    return () => {
      console.log('cleaned')
      window.removeEventListener('message', onMessage)
    }
  })
