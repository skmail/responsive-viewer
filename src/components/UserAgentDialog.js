import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from './Fields/Text'
import Button from '@material-ui/core/Button'
import { reduxForm } from 'redux-form'
import * as validation from '../utils/validation'
import { USER_AGENT_DIALOG_FORM_NAME } from '../constants'

const useStyles = makeStyles(() => ({
    body: {
        width: 350,
        borderRadius: 4,
    },
}))

const UserAgentDialog = props => {
    const {
        handleSubmit,
        onSubmit: _onSubmit,
        invalid,
        reset,
        userAgents,
        open,
        onClose,
    } = props
    const classes = useStyles()

    const handleClose = () => {
        onClose()
        reset()
    }

    const onSubmit = values => {
        _onSubmit(values)
        handleClose()
    }

    const uniqueNameValidator = useCallback(
        value => {
            const agent = userAgents.find(
                agent => agent.name.toLowerCase() === value.toLowerCase()
            )
            if (!agent) {
                return undefined
            }
            return 'User agent name already exists'
        },
        [userAgents]
    )

    const id = open ? 'user-agent-form-dialog' : undefined

    return (
        <div>
            <Dialog id={id} open={open} onClose={handleClose}>
                <DialogTitle>Add new user agent</DialogTitle>
                <DialogContent>
                    <div className={classes.body}>
                        <TextField
                            autoComplete={'off'}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            label="Name"
                            color="secondary"
                            validate={[
                                validation.required,
                                uniqueNameValidator,
                            ]}
                            name={'name'}
                        />

                        <TextField
                            autoComplete={'off'}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            label="User agent header"
                            color="secondary"
                            validate={[validation.required]}
                            name={'value'}
                        />

                        <DialogActions>
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                disabled={invalid}
                                variant={'contained'}
                                color={'primary'}
                                type={'submit'}
                            >
                                Add User agent
                            </Button>
                            <Button onClick={handleClose}>Cancel</Button>
                        </DialogActions>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default reduxForm({
    form: USER_AGENT_DIALOG_FORM_NAME,
    initialValues: {
        name: '',
        value: '',
    },
})(UserAgentDialog)
