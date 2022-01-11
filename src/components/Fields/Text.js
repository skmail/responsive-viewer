import React from 'react'
import { Field } from 'redux-form'
import TextField from '@material-ui/core/TextField'

const renderTextField = props => {
  const {
    placeholder,
    input,
    meta: { touched, invalid, error },
    showError,
    validationError = true,
    ...custom
  } = props

  return (
    <TextField
      placeholder={placeholder}
      error={touched && invalid && validationError}
      helperText={showError && touched && validationError && error}
      variant={'standard'}
      {...input}
      {...custom}
    />
  )
}

export default props => <Field component={renderTextField} {...props} />
