;(() => {
  // var console = {}
  // Object.keys(window.console).forEach(name => {
  //   console[name] = function() {}
  // })

  window.console = console

  for (const element of document.documentElement.children) {
    if (['head', 'body'].includes(element.tagName)) {
      element.parentNode.removeChild(element)
    }
  }

  document.head.innerHTML = ''
  document.body.innerHTML = ''

  const removeAttributes = element => {
    Object.values(element.attributes).forEach(attribute => {
      element.removeAttribute(attribute.name)
    })
  }

  removeAttributes(document.body)
  removeAttributes(document.documentElement)

  const appRoot = document.createElement('div')

  appRoot.id = 'RESPONSIVE-VIEWER-ROOT'

  document.body.appendChild(appRoot)

  window.WebSocket.prototype.onmessage = () => {
    console.log('what')
  }
})()
