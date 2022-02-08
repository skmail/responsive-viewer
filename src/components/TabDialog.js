import React, { useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from './Fields/Text'
import Button from '@material-ui/core/Button'
import { reduxForm } from 'redux-form'
import * as validation from '../utils/validation'
import { TAB_DIALOG_FORM_NAME } from '../constants'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getTabDialog, getTabs } from '../selectors'
import { toggleTabDialog, updateTab, addTab, deleteTab } from '../actions'

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

const TabDialogInternal = ({ initialValues, handleSubmit, invalid, reset }) => {
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)
  const classes = useStyles()
  const tabName = initialValues && initialValues.name

  const dispatch = useDispatch()

  const isUpdate = Boolean(tabName)

  const handleClose = () => {
    dispatch(toggleTabDialog())
    reset()
  }
  const onSubmit = values => {
    if (isUpdate) {
      dispatch(updateTab(tabName, values))
    } else {
      dispatch(addTab(values))
    }
    handleClose()
  }
  const id = 'screen-dialog'
  const onDelete = () => {
    dispatch(deleteTab(tabName))
    setIsDeleteDialogOpened(false)
    handleClose()
  }

  const tabs = useSelector(
    state => getTabs(state).map(tab => tab.name),
    shallowEqual
  )

  const uniqueTabs = useMemo(() => {
    return validation.uniqueTabs(tabs, tabName)
  }, [tabName, tabs])

  return (
    <Dialog id={id} open={true} onClose={handleClose}>
      <DialogTitle>
        {isUpdate ? `Update ${tabName} Screen` : 'Add new tab'}
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
            validate={[validation.required, uniqueTabs]}
            name={'name'}
            showError
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

const TabDialogForm = reduxForm({
  form: TAB_DIALOG_FORM_NAME,
  enableReinitialize: true,
})(TabDialogInternal)

const TabDialog = props => {
  const tabDialog = useSelector(getTabDialog)

  if (!tabDialog.open) {
    return null
  }

  return <TabDialogForm initialValues={tabDialog.initialValues} />
}

export default TabDialog
