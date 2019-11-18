import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from './Fields/Text'
import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import SwitchField from './Fields/Switch'
import SelectField from './Fields/Select'
import { reduxForm } from 'redux-form'
import * as validation from '../utils/validation'
import * as normalizers from '../utils/normalizers'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import { SCREEN_DIALOG_FORM_NAME } from '../constants'

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
    backgroundColor: theme.palette.danger.main,
    color: theme.palette.danger.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.danger.light,
    },
    '&:active': {
      backgroundColor: theme.palette.danger.dark,
    },
  },
  dialogAction: {},
}))

const ScreenDialog = props => {
  const {
    handleSubmit,
    onSubmit: _onSubmit,
    invalid,
    reset,
    userAgents,
    open,
    onClose,
    toggleUserAgentDialog,
    initialValues,
    deleteScreen,
  } = props

  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)

  const classes = useStyles()

  const screenId = initialValues && initialValues.id

  const isUpdate = Boolean(screenId)

  const handleClose = () => {
    onClose()
    reset()
  }

  const onSubmit = values => {
    _onSubmit(values)
    handleClose()
  }

  const id = open ? 'screen-dialog' : undefined

  const onScreenDelete = () => {
    deleteScreen(screenId)
    setIsDeleteDialogOpened(false)
    onClose()
  }

  return (
    <Dialog id={id} open={open} onClose={handleClose}>
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
            validate={[validation.required]}
            name={'name'}
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
              name={'width'}
              validate={[validation.required]}
              type={'number'}
              normalize={normalizers.number}
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
              name={'height'}
              validate={[validation.required]}
              type={'number'}
              normalize={normalizers.number}
            />
          </Box>

          <Box display={'flex'} alignItems={'center'}>
            <SelectField
              label={'User Agent'}
              margin="dense"
              name={'userAgent'}
              options={userAgents.map(userAgent => ({
                value: userAgent.name,
                label: userAgent.name,
              }))}
              validate={[validation.required]}
            />

            <IconButton
              color="inherit"
              aria-label="toggle user agent dialog"
              onClick={toggleUserAgentDialog}
              edge="start"
            >
              <AddIcon />
            </IconButton>
          </Box>

          <SwitchField name={'visible'} label={'Visible?'} />

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
                <Button
                  onClick={() => setIsDeleteDialogOpened(true)}
                  variant={'contained'}
                  className={classes.delete}
                >
                  Delete
                </Button>
              </React.Fragment>
            )}

            <Button
              disabled={invalid}
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

export default reduxForm({
  form: SCREEN_DIALOG_FORM_NAME,
  enableReinitialize: true,
})(ScreenDialog)
