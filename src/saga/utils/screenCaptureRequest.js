import platform from '../../platform'

export const screenCaptureRequest = () =>
  new Promise(accept => {
    const resolve = response => {
      if (!response.image) {
        accept(false)
        return
      }
      const image = new Image()
      image.onload = function() {
        accept(image)
      }
      image.onerror = function() {
        accept(false)
      }
      image.src = response.image
    }
    return resolve({
      image: '/test.jpeg',
    })
    platform.runtime.sendMessage({ message: 'CAPTURE_SCREEN' }, function(
      response
    ) {
      resolve(response)
    })
  })
