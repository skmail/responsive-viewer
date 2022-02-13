//https://gist.github.com/karlgroves/7544592
function getDomPath(el: HTMLElement) {
  const stack = []

  while (el.parentElement != null) {
    let sibCount = 0
    let sibIndex = 0
    for (let i = 0; i < el.parentElement.childNodes.length; i++) {
      let sib = el.parentElement.childNodes[i]
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

  stack.shift()
  stack.unshift('  ')

  // removes the html element
  return stack
}

export default function domPath(element: HTMLElement) {
  return getDomPath(element).join(' > ')
}
