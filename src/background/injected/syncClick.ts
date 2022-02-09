import getDomPath from '../../utils/domPath'

const onMouseDown = (e: MouseEvent) => {
  if (!e.isTrusted || !window.top) {
    return true
  }
  const target = e.target as HTMLElement

  if (!target) {
    return
  }

  const path = getDomPath(target)

  const onUp = (event: MouseEvent) => {
    if (!window.top) {
      return
    }
    if (event.target === target) {
      window.top.postMessage(
        {
          message: '@APP/CLICK',
          frameId: window.frameID,
          path,
        },
        '*'
      )
    }
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mouseup', onUp)
}

const onInput = (e: Event) => {
  if (!e.isTrusted || !window.top) {
    return
  }

  const target = e.target as HTMLInputElement

  if (!target) {
    return
  }
  const path = getDomPath(target)
  window.top.postMessage(
    {
      message: '@APP/DELEGATE_EVENT',
      frameId: window.frameID,
      path,
      value: target.value,
    },
    '*'
  )
}
export default () => {
  document.addEventListener('mousedown', onMouseDown)

  document.addEventListener('input', onInput)
}

export const simulateClick = (data: { path: string }) => {
  const element = document.querySelector(data.path)

  if (!element) {
    return
  }

  const evt = new MouseEvent('click', {
    bubbles: true,
    cancelable: false,
    view: window,
  })
  element.dispatchEvent(evt)
}

export const triggerEvent = (data: { path: string; value: any }) => {
  const element = document.querySelector(data.path) as HTMLInputElement

  if (!element) {
    return
  }

  const evt = new KeyboardEvent('input', {
    bubbles: true,
    cancelable: false,
    view: window,
  })
  element.dispatchEvent(evt)
  element.value = data.value
}
