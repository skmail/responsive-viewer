import $ from 'jquery'

$.fn.findOrAppend = function(selector) {
  var elements = this.find(selector)
  return elements.length
    ? elements
    : $(`<div class="${selector.replace('.', '')}">`).appendTo(this)
}
