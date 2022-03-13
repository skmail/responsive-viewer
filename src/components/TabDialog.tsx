import React, { useCallback, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { shallowEqual } from 'react-redux'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { selectTabs, addTab, updateTab, deleteTab } from '../reducers/app'
import { toggleTabDialog, selectTabDialog } from '../reducers/layout'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as validation from '../utils/validation'
import { errorMessage } from '../utils/errorMessage'

const TabDialogForm = ({
  values,
}: {
  values: {
    name: string
  }
}) => {
  const id = 'screen-dialog'
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)

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
    <Dialog maxWidth={'xs'} fullWidth id={id} open={true} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isUpdate ? `Update ${tabName} tab` : 'Add new tab'}
        </DialogTitle>
        <DialogContent>
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
        </DialogContent>

        <DialogActions>
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
                color="error"
                sx={{ marginRight: 'auto' }}
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
