import React from "react";
import {Field} from "redux-form";
import TextField from "@material-ui/core/TextField";


const renderTextField = (props) => {

  const {
    placeholder,
    input,
    meta: { touched, invalid, error },
    showError,
    ...custom
  } = props
  return (
    <TextField
      placeholder={placeholder}
      error={touched && invalid}
      helperText={showError && touched && error}
      variant={"standard"}
      {...input}
      {...custom}
    />
  )
}

export default props => (
  <Field component={renderTextField} {...props} />
)