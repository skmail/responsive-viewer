import React, { useCallback } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
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

const UserAgentDialog = () => {
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add new user agent</DialogTitle>

          <DialogContent>
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
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={false} variant={'contained'} color={'primary'}>
              Add User agent
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default UserAgentDialog
