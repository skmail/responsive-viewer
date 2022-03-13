import { FieldError } from 'react-hook-form'

export const errorMessage = (error: FieldError, attribute = 'This field') => {
  let errorText = ''
  switch (error.type) {
    case 'required':
      errorText = ':attribute is required'
      break
    case 'unique':
      errorText = ':attribute is already taken'
      break
    case 'url':
      errorText = ':attribute is not a valid url'
      break
  }

  return errorText.replace(':attribute', attribute)
}
