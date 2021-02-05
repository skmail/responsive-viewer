import $ from 'jquery'

$.fn.findOrAppend = function(selector) {
  var elements = this.find(selector)
  return elements.length
    ? elements
    : $(`<div class="${selector.replace('.', '')}">`).appendTo(this)
}

export function cloneEvent(e) {
  const obj = {}
  for (let k in e) {
    const v = e[k]

    if (
      v === null ||
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
