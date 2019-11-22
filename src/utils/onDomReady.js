const onDomReady = callback => {
  if (document && document.getElementsByTagName('body')[0]) {
    callback()
    return
  }

  if (callback && typeof callback === 'function') {
    if (document.readyState === 'complete') {
      callback()
    } else {
      window.addEventListener(
        'onload',
        function() {
          callback()
        },
        false
      )
    }
  }
}

export default onDomReady
