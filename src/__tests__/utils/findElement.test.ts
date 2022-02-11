import findElement, { splitPath } from '../../utils/findElement'
import domPath from '../../utils/domPath'
const append = (element: HTMLElement, parent: HTMLElement) =>
  parent.appendChild(element)

test('split dom path', () => {
  expect(splitPath('div#id.class:eq(1) .element')).toStrictEqual([
    'div#id.class',
    1,
    '.element',
  ])
})

const createElement = (id?: string) => {
  const element = document.createElement('div')
  if (id) {
    element.id = id
  }
  return element
}
test('find', () => {
  const element = createElement('element')
  const element1 = createElement('element1')
  const element2 = createElement('element2')

  append(element1, element)
  append(element2, element)

  const element3 = createElement('element3')

  append(element3, element1)
  const element4 = createElement()
  append(element4, element)

  append(element, document.body)

  expect(findElement(domPath(element4))).toBe(element4)
  expect(findElement(domPath(element3))).toBe(element3)
  expect(findElement(domPath(element1))).toBe(element1)
})

test('splitPath', () => {
  expect(splitPath('div#__next > div > div:eq(10)')).toStrictEqual([
    'div#__next > div > div',
    10,
  ])
  //
})
