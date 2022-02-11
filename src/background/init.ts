import platform from '../platform'

const init = () => {
  window.console = console

  function setTimeout<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    ms?: number,
    ...args: TArgs
  ): number {
    platform.runtime.sendMessage({ message: 'WAIT', time: ms, args }, callback)

    return 0
  }

  // @ts-ignore
  window.setTimeout = setTimeout

  const children = document.documentElement.children

  for (let i = 0; i < children.length; i++) {
    const element = children[i]
    if (['head', 'body'].includes(element.tagName) && element.parentNode) {
      element.parentNode.removeChild(element)
    }
  }

  document.head.innerHTML = ''
  document.body.innerHTML = ''

  const removeAttributes = (element: HTMLElement) => {
    Object.values(element.attributes).forEach(attribute => {
      element.removeAttribute(attribute.name)
    })
  }

  removeAttributes(document.body)
  removeAttributes(document.documentElement)

  const appRoot = document.createElement('div')

  appRoot.id = 'RESPONSIVE-VIEWER-ROOT'

  document.body.appendChild(appRoot)
}

init()

export default init
