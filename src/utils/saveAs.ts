export const saveAs = (data: Blob | string, name: string) => {
  const link = document.createElement('a')
  link.innerText = 'Download'
  document.body.appendChild(link)
  link.download = name
  const isBlob = data instanceof Blob
  link.href = isBlob ? URL.createObjectURL(data) : data
  link.click()
  document.body.removeChild(link)
  if (isBlob) {
    URL.revokeObjectURL(link.href)
  }
}
