import JSZip from 'jszip'
import { imgSrcToBlob } from 'blob-util'
import { ToZipInput } from '../types'

export const toZip = async (files: ToZipInput) => {
  var zip = new JSZip()

  for (let file of files) {
    const image = await imgSrcToBlob(file.url)

    zip.file(file.filename, image)
  }

  const result = await zip.generateAsync({ type: 'blob' })

  return result
}
