import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'

import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  selectScreenDialog,
  toggleScreenDialog,
  toggleUserAgentDialog,
} from '../reducers/layout'
import { Device } from '../types'
import { errorMessage } from '../utils/errorMessage'
import {
  deleteScreen,
  saveScreen,
  selectScreenById,
  selectUserAgents,
} from '../reducers/app'
import { useAppDispatch } from '../hooks/useAppDispatch'

const useStyles = makeStyles(theme => ({
  body: {
    width: 350,
    borderRadius: 4,
  },
  widthInput: {
    marginRight: theme.spacing(2),
  },
  delete: {
    marginRight: 'auto',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.light,
    },
    '&:active': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  dialogAction: {},
}))

const ScreenDialog = () => {
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)

  const classes = useStyles()

  const screenDialog = useAppSelector(selectScreenDialog)
  const userAgents = useAppSelector(selectUserAgents)

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

  const screen = useAppSelector(state => selectScreenById(state, screenId))

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
    dispatch(saveScreen(values))
    handleClose()
  }

  const id = screenDialog.open ? 'screen-dialog' : undefined

  const onScreenDelete = () => {
    dispatch(deleteScreen(screenId))
    handleClose()
  }

  useEffect(() => {
    setValue('userAgent', screenDialog.values.userAgent)
  }, [screenDialog.values.userAgent, setValue])

  return (
    <Dialog id={id} open={screenDialog.open} onClose={handleClose}>
      <DialogTitle>{isUpdate ? 'Update Screen' : 'Add new screen'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.body}>
          <TextField
            autoComplete={'off'}
            fullWidth
            margin="dense"
            variant="outlined"
            label="Screen name"
            color="secondary"
            error={!!errors.name}
            helperText={!!errors.name && errorMessage(errors.name)}
            {...register('name', {
              required: true,
            })}
          />

          <Box display="flex">
            <TextField
              autoComplete={'off'}
              margin="dense"
              variant="outlined"
              label="Width"
              color="secondary"
              className={classes.widthInput}
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
              margin="dense"
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
          </Box>

          <Box display={'flex'} alignItems={'center'}>
            <Controller
              name="userAgent"
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <TextField
                    margin="dense"
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
                    {userAgents.map(userAgent => (
                      <MenuItem key={userAgent.name} value={userAgent.name}>
                        {userAgent.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              }}
            />
          </Box>

          <DialogActions classes={{ root: classes.dialogAction }}>
            {isUpdate && (
              <React.Fragment>
                <Dialog open={isDeleteDialogOpened}>
                  <DialogTitle>Confirm screen deletion?</DialogTitle>
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

                {!isUpdate && (
                  <Button
                    onClick={() => setIsDeleteDialogOpened(true)}
                    variant={'contained'}
                    className={classes.delete}
                  >
                    Delete
                  </Button>
                )}
              </React.Fragment>
            )}

            <Button
              disabled={false}
              variant={'contained'}
              color={'primary'}
              type={'submit'}
            >
              {isUpdate ? 'Update' : 'Add Screen'}
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ScreenDialog
