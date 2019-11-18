import React from 'react'
import { Field } from 'redux-form'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

const renderTextField = props => {
    const {
        placeholder,
        input,
        meta: { touched, invalid, error },
        showError,
        options,
        ...custom
    } = props
    return (
        <TextField
            fullWidth
            placeholder={placeholder}
            error={touched && invalid}
            helperText={showError && touched && error}
            variant={'outlined'}
            select
            {...input}
            {...custom}
        >
            {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    )
}

export default props => <Field component={renderTextField} {...props} />
