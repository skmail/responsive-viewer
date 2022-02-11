import platform from '../../platform'

export const screenCaptureRequest = () =>
  new Promise(accept => {
    const resolve = (response: any) => {
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

    platform.runtime.sendMessage({ message: 'CAPTURE_SCREEN' }, function(
      response: any
    ) {
      resolve(response)
    })
  })
