import { END, eventChannel } from 'redux-saga'

type Message = {
  message: string
}

type Event<T> = {
  data: T
}
export const iframeChannel = (name = '@APP/', stopOnFirstMessage = false) =>
  eventChannel(emitter => {
    const onMessage = (event: Event<Message>) => {
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
      window.removeEventListener('message', onMessage)
    }
  })
