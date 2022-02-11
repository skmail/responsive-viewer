import scrollIntoView from 'scroll-into-view'
export const scrollToElement = (
  element: HTMLElement,
  align = {},
  settings = {}
) =>
  new Promise(resolve => {
    scrollIntoView(
      element,
      {
        time: 220,
        align: {
          top: 0,
          left: 0,
          topOffset: 0,
          leftOffset: 0,
          ...align,
        },
        ...settings,
      },
      () => {
        resolve(true)
      }
    )
  })
