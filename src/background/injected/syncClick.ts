import getDomPath from '../../utils/domPath'
import findElement from '../../utils/findElement'
import { sendMessage } from './sendMessage'

const onClick = (e: MouseEvent) => {
  if (!e.isTrusted) {
    return true
  }
  const target = e.target as HTMLElement

  if (!target) {
    return
  }

  const path = getDomPath(target)

  sendMessage('@APP/CLICK', {
    path,
  })
}

const onInput = (e: Event) => {
  if (!e.isTrusted) {
    return
  }

  const target = e.target as HTMLInputElement

  if (!target) {
    return
  }

  const path = getDomPath(target)

  sendMessage('@APP/DELEGATE_EVENT', {
    path,
    value: target.value,
  })
}

export default function syncClick() {
  document.addEventListener('click', onClick)

  document.addEventListener('input', onInput)
}

export const triggerClickEvent = ({ path }: { path: string }) => {
  let element = findElement(path) as HTMLElement
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

export const triggerInputEvent = ({
  path,
  value,
}: {
  path: string
  value: string
}) => {
  const element = findElement(path) as HTMLInputElement

  if (!element) {
    return
  }

  const evt = new KeyboardEvent('input', {
    bubbles: true,
    cancelable: false,
    view: window,
  })
  element.dispatchEvent(evt)
  element.value = value
}
