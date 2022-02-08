import scrollIntoView from 'scroll-into-view'
export const scrollToElement = (element, align = {}, settings = {}) =>
  new Promise(resolve => {
    scrollIntoView(
      element,
      {
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
        resolve()
      }
    )
  })
