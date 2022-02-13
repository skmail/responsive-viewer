import platform from '../../platform'
import { getPrefixedMessage } from '../../utils/getPrefixedMessage'

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
      image.onerror = function(error) {
        accept(false)
      }
      image.src = response.image
    }

    platform.runtime.sendMessage(
      { message: getPrefixedMessage('CAPTURE_SCREEN') },
      function(response: any) {
        resolve(response)
      }
    )
  })
