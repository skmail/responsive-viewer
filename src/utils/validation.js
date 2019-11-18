import isURL from 'validator/lib/isURL'

export const url = value => {
  return isURL(value, {
    require_tld: false,
    require_protocol: true,
  })
    ? undefined
    : 'Invalid URL'
}

export const required = value =>
  value && String(value).trim() !== '' ? undefined : 'Required'
