import parse from 'url-parse'

const clean = url => String(url).replace(/^\/|\/$/g, '')

export const isLocal = url =>
  String(url).startsWith('chrome://') ||
  String(url).startsWith('chrome-extension://')

export const isExtension = url =>
  Boolean(url) && clean(url).startsWith(clean(chrome.runtime.getURL('/')))

export const origins = url => {
  const hostname = parse(url).hostname
  return [`https://${hostname}`, `http://${hostname}`]
}
