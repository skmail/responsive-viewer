//https://gist.github.com/karlgroves/7544592
function getDomPath(el: HTMLElement) {
  var stack = []

  while (el.parentElement != null) {
    var sibCount = 0
    var sibIndex = 0
    for (var i = 0; i < el.parentElement.childNodes.length; i++) {
      var sib = el.parentElement.childNodes[i]
      if (sib.nodeName === el.nodeName) {
        if (sib === el) {
          sibIndex = sibCount
        }
        sibCount++
      }
    }
    if (el.hasAttribute('id') && el.id !== '') {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id)
    } else if (sibCount > 1) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')')
    } else {
      stack.unshift(el.nodeName.toLowerCase())
    }
    el = el.parentElement
  }

  return stack.slice(1) // removes the html element
}

export default function domPath(element: HTMLElement) {
  return getDomPath(element).join(' > ')
}
