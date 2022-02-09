import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  selectUserAgentDialog,
  toggleUserAgentDialog,
} from '../reducers/layout'
import { useForm, SubmitHandler } from 'react-hook-form'
import { UserAgent } from '../types'
import { saveUserAgent, selectUserAgents } from '../reducers/app'
import * as validation from '../utils/validation'
import { errorMessage } from '../utils/errorMessage'
import { useAppDispatch } from '../hooks/useAppDispatch'

const useStyles = makeStyles(() => ({
  body: {
    width: 350,
    borderRadius: 4,
  },
}))

const UserAgentDialog = () => {
  const classes = useStyles()

  const userAgentDialog = useAppSelector(selectUserAgentDialog)
  const dispatch = useAppDispatch()

  const handleClose = () => {
    dispatch(toggleUserAgentDialog())
  }

  const onSubmit: SubmitHandler<UserAgent> = values => {
    dispatch(saveUserAgent(values))
    handleClose()
  }

  const userAgents = useAppSelector(state =>
    selectUserAgents(state).map(userAgent => userAgent.name)
  )

  const uniqueUserAgent = useCallback(
    (value: string) => {
      return validation.unique(userAgents)(String(value).toLowerCase())
    },
    [userAgents]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: userAgentDialog.values,
  })

  const id = userAgentDialog.open ? 'user-agent-form-dialog' : undefined

  return (
    <div>
      <Dialog id={id} open={userAgentDialog.open} onClose={handleClose}>
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
              error={!!errors.name}
              helperText={
                !!errors.name && errorMessage(errors.name, 'User agent')
              }
              {...register('name', {
                required: true,
                validate: {
                  unique: uniqueUserAgent,
                },
              })}
            />

            <TextField
              autoComplete={'off'}
              fullWidth
              margin="dense"
              variant="outlined"
              label="User agent header"
              color="secondary"
              error={!!errors.value}
              helperText={
                !!errors.value &&
                errorMessage(errors.value, 'User agent header')
              }
              {...register('value', {
                required: true,
              })}
            />

            <DialogActions>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={false}
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

export default UserAgentDialog
