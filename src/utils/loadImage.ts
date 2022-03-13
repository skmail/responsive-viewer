export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((accept, reject) => {
    const image = new Image()
    image.onload = function() {
      accept(image)
    }
    image.onerror = function() {
      reject()
    }
    image.src = url
  })
}
