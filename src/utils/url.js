import parse from 'url-parse'
import platform from '../platform'

const clean = url => String(url).replace(/^\/|\/$/g, '')

export const isLocal = url =>
  String(url).startsWith('chrome://') ||
  String(url).startsWith('chrome-extension://')

export const isExtension = url => {
  return (
    Boolean(url) && clean(url).startsWith(clean(platform.runtime.getURL('/')))
  )
}

export const origins = url => {
  const hostname = parse(url).hostname
  return [`https://${hostname}`, `http://${hostname}`]
}

/**
 * @url https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
 *
 * @param url
 * @returns {string}
 */
export const extractHostname = url => {
  let hostname
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  //find & remove port number
  hostname = hostname.split(':')[0]
  //find & remove "?"
  hostname = hostname.split('?')[0]

  return hostname
}

export const slugify = str => {
  str = str.replace(/^\s+|\s+$/g, '') // trim

  // remove accents, swap ñ for n, etc
  const from = 'àáãäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaaeeeeiiiioooouuuunc------'

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^A-Za-z0-9 -.]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}
