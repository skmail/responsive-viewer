import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import uuid from 'uuid'

import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  selectScreenDialog,
  toggleScreenDialog,
  toggleUserAgentDialog,
} from '../reducers/layout'
import { Device, UserAgent } from '../types'
import { errorMessage } from '../utils/errorMessage'
import {
  deleteScreen,
  saveScreen,
  selectScreenById,
  selectUserAgents,
} from '../reducers/app'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { shallowEqual } from 'react-redux'
import Typography from '@mui/material/Typography'

const getUserAgentsList = (userAgents: UserAgent[], current: string) => {
  if (!current) {
    return userAgents
  }

  const found = userAgents.find(userAgent => userAgent.value === current)

  if (found) {
    return userAgents
  }

  return [...userAgents, { value: current, name: current }]
}

const ScreenDialog = () => {
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)

  const screenDialog = useAppSelector(selectScreenDialog)
  const userAgents = useAppSelector(selectUserAgents, shallowEqual)
  const [userAgentsList, setUserAgentsList] = useState<UserAgent[]>([])

  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    defaultValues: screenDialog.values,
  })

  const screenId = screenDialog.values.id

  const screen = useAppSelector(
    state => (screenId ? selectScreenById(state, screenId) : null),
    shallowEqual
  )

  const isUpdate = !!screen

  useEffect(() => {
    if (screen) {
      const entries = Object.entries(screen)
      entries.forEach(([key, value]) => {
        setValue(key as keyof Device, value)
      })
    }
  }, [screen, setValue])

  const handleClose = () => {
    dispatch(toggleScreenDialog())
    reset()
  }

  const onSubmit: SubmitHandler<Device> = values => {
    values = {
      ...values,
      id: screenId || uuid.v4(),
      width: values.width,
      height: values.height,
    }

    dispatch(saveScreen(values))
    handleClose()
  }

  const id = screenDialog.open ? 'screen-dialog' : undefined

  const onScreenDelete = () => {
    dispatch(deleteScreen(screenId))
    handleClose()
    setIsDeleteDialogOpened(false)
  }

  useEffect(() => {
    let userAgent = screenDialog.values.userAgent
    setValue('userAgent', userAgent)
    setUserAgentsList(getUserAgentsList(userAgents, userAgent))
  }, [screenDialog.values.userAgent, setValue, userAgents])

  return (
    <Dialog id={id} open={screenDialog.open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isUpdate ? 'Update Screen' : 'Add new screen'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} direction="column">
            <TextField
              autoComplete={'off'}
              fullWidth
              variant="outlined"
              label="Screen name"
              color="secondary"
              error={!!errors.name}
              helperText={!!errors.name && errorMessage(errors.name)}
              {...register('name', {
                required: true,
              })}
            />

            <Stack spacing={2} direction="row">
              <TextField
                autoComplete={'off'}
                variant="outlined"
                label="Width"
                color="secondary"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
                type={'number'}
                {...register('width', {
                  required: true,
                })}
                error={!!errors.width}
                helperText={!!errors.width && errorMessage(errors.width)}
              />

              <TextField
                autoComplete={'off'}
                variant="outlined"
                label="Height"
                color="secondary"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
                type={'number'}
                {...register('height', {
                  required: true,
                })}
                error={!!errors.height}
                helperText={!!errors.height && errorMessage(errors.height)}
              />
            </Stack>

            <Box display={'flex'} alignItems={'center'}>
              <Controller
                name="userAgent"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <TextField
                      label="User Agent"
                      fullWidth
                      variant={'outlined'}
                      select
                      {...field}
                      error={!!errors.userAgent}
                      helperText={
                        !!errors.userAgent && errorMessage(errors.userAgent)
                      }
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            color="inherit"
                            aria-label="toggle user agent dialog"
                            onClick={() => dispatch(toggleUserAgentDialog())}
                            edge="start"
                          >
                            <AddIcon />
                          </IconButton>
                        ),
                      }}
                    >
                      {userAgentsList.map(userAgent => (
                        <MenuItem key={userAgent.name} value={userAgent.name}>
                          {userAgent.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )
                }}
              />
            </Box>
          </Stack>

          <Typography variant="caption" sx={{ marginTop: 2, display: 'block' }}>
            Changes on the screen config will be applied on all tabs that
            includes this screen. if you are looking to change only this screen,
            duplicate the screen by + icon on the right corner of the app
            header.
          </Typography>
        </DialogContent>

        <DialogActions>
          {isUpdate && (
            <React.Fragment>
              <Dialog open={isDeleteDialogOpened}>
                <DialogTitle>Confirm screen deletion?</DialogTitle>

                <DialogContent>
                  This action will delete this screen from all tabs, if you wish
                  to delete this screen from specific tab, you can click the
                  remove icon from screens view on the sidebar.
                </DialogContent>
                <DialogActions>
                  <Button
                    variant={'contained'}
                    onClick={onScreenDelete}
                    color={'primary'}
                  >
                    Confirm
                  </Button>

                  <Button onClick={() => setIsDeleteDialogOpened(false)}>
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>

              <Button
                sx={{
                  marginRight: 'auto',
                }}
                onClick={() => setIsDeleteDialogOpened(true)}
                color={'error'}
                variant={'contained'}
              >
                Delete
              </Button>
            </React.Fragment>
          )}

          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={false}
            variant={'contained'}
            color={'primary'}
            type={'submit'}
          >
            {isUpdate ? 'Update' : 'Add Screen'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ScreenDialog
