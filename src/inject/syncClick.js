import getDomPath from '../utils/domPath'
import $ from 'jquery'

function cloneEvent(e) {
  const obj = {}
  for (let k in e) {
    const v = e[k]

    if (
      v instanceof Node ||
      v instanceof Window ||
      typeof v === 'function' ||
      Array.isArray(v) | (v && typeof v === 'object')
    ) {
      continue
    }
    obj[k] = v
  }
  return obj
}

export default () => {
  document.addEventListener('mousedown', e => {
    if (!e.isTrusted) {
      return true
    }

    const target = e.target
    const path = getDomPath(target)

    const onUp = e => {
      if (e.target === target) {
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
  })

  const onInputEvent = e => {
    if (!e.isTrusted) {
      return
    }

    const target = e.target
    const path = getDomPath(target)
    window.top.postMessage(
      {
        message: '@APP/DELEGATE_EVENT',
        frameId: window.frameID,
        path,
        value: e.target.value,
      },
      '*'
    )
  }

  document.addEventListener('input', onInputEvent)
}

export const simulateClick = data => {
  const element = $(data.path)

  if (element.length) {
    const evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: false,
      view: window,
    })
    element[0].dispatchEvent(evt)
  }
}

export const triggerEvent = data => {
  const element = $(data.path)

  if (element.length) {
    const evt = new KeyboardEvent('input', {
      bubbles: true,
      cancelable: false,
      view: window,
    })
    element[0].dispatchEvent(evt)
    element[0].value = data.value
  }
}
