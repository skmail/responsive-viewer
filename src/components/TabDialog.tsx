import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { shallowEqual } from 'react-redux'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { selectTabs, addTab, updateTab, deleteTab } from '../reducers/app'
import { toggleTabDialog, selectTabDialog } from '../reducers/layout'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as validation from '../utils/validation'
import { errorMessage } from '../utils/errorMessage'

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

const TabDialogForm = ({
  values,
}: {
  values: {
    name: string
  }
}) => {
  const id = 'screen-dialog'
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)
  const classes = useStyles()
  const tabName = String(values.name || '')

  const dispatch = useAppDispatch()

  const isUpdate = Boolean(tabName)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: values,
  })

  const handleClose = () => {
    dispatch(toggleTabDialog())
  }

  const onSubmit: SubmitHandler<{ name: string }> = values => {
    if (isUpdate) {
      dispatch(
        updateTab({
          name: tabName,
          tab: values,
        })
      )
    } else {
      dispatch(addTab(values))
    }
    handleClose()
  }

  const onDelete = () => {
    dispatch(deleteTab(tabName))
    setIsDeleteDialogOpened(false)
    handleClose()
  }

  const tabs = useAppSelector(
    state => selectTabs(state).map(tab => tab.name.toLowerCase()),
    shallowEqual
  )

  const uniqueTabs = useCallback(
    (value: string) => {
      return validation.unique(tabs, tabName)(String(value).toLowerCase())
    },
    [tabName, tabs]
  )

  const invalid = false

  return (
    <Dialog id={id} open={true} onClose={handleClose}>
      <DialogTitle>
        {isUpdate ? `Update ${tabName} tab` : 'Add new tab'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.body}>
          <TextField
            autoComplete={'off'}
            fullWidth
            margin="dense"
            variant="outlined"
            label="Tab name"
            color="secondary"
            error={!!errors.name}
            helperText={!!errors.name && errorMessage(errors.name)}
            {...register('name', {
              required: true,
              validate: {
                unique: uniqueTabs,
              },
            })}
          />

          <DialogActions classes={{ root: classes.dialogAction }}>
            {isUpdate && (
              <React.Fragment>
                <Dialog open={isDeleteDialogOpened}>
                  <DialogTitle>Confirm tab deletion?</DialogTitle>
                  <DialogActions>
                    <Button
                      variant={'contained'}
                      onClick={onDelete}
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
              {isUpdate ? 'Update' : 'Add Tab'}
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const TabDialog = () => {
  const tabDialog = useAppSelector(selectTabDialog)

  if (!tabDialog.open) {
    return null
  }

  return <TabDialogForm values={tabDialog.values} />
}

export default TabDialog
