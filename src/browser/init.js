;(() => {
  const removeChildren = element => {
    while (element.children.length) {
      element.removeChild(element.children[0])
    }
  }

  removeChildren(document.head)
  removeChildren(document.body)

  Object.keys(document.body.attributes).forEach(attribute => {
    document.body.removeAttribute(attribute)
  })

  const appRoot = document.createElement('div')

  appRoot.id = 'RESPONSIVE-VIEWER-ROOT'

  document.body.appendChild(appRoot)
})()
