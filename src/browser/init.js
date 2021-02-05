;(() => {
  const removeChildren = element => {
    while (element.children.length) {
      element.removeChild(element.children[0])
    }
  }

  removeChildren(document.head)
  removeChildren(document.body)

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

  window.addEventListener('message', function(message) {
    if (message.data.message !== '@ADS/LOADED') {
      return
    }

    const iframe = document.getElementById('advertismentIframe')

    const height = Math.min(150, message.data.height)

    iframe.style.width = '100%'
    iframe.style.height = `${height}px`
  })

  window.addEventListener('scroll', e => {
    console.log('scroll', e)
  })
})()
