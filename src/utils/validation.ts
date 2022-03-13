import isURL from 'validator/lib/isURL'

export const url = (value: string) => {
  return isURL(value, {
    require_tld: false,
    require_protocol: true,
  })
}

export const required = (value: string) =>
  value && String(value).trim() !== '' ? undefined : 'Required'

export const unique = (list: string[], exclude?: string) => (value: string) => {
  if (list.includes(value) && exclude !== value) {
    return false
  }
  return
}
