import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'

const useStyles = makeStyles(theme => ({
  body: {
    width: 350,
    borderRadius: 4,
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}))

const HelpDialog = props => {
  const { open, onClose, appReset } = props
  const classes = useStyles()
  const [isAppResetOpened, setIsAppResetOpened] = useState(false)

  const id = open ? 'help-dialog' : undefined

  const onAppReset = () => {
    appReset()
    setIsAppResetOpened(true)
    onClose()
  }

  return (
    <div>
      <Dialog id={id} open={open} onClose={onClose}>
        <DialogTitle>Help!</DialogTitle>
        <DialogContent>
          <div className={classes.body}>
            <DialogContentText>
              Edit Screen by <Chip size="small" label={'double click'} /> on the
              screen name from sidebar.
            </DialogContentText>

            <DialogContentText>
              Hold <Chip size="small" label={'shift'} /> while scrolling to
              disable iframe scroll.
            </DialogContentText>

            <DialogActions className={classes.dialogActions}>
              <Button onClick={() => setIsAppResetOpened(true)}>
                App Reset
              </Button>
              <Dialog open={isAppResetOpened}>
                <DialogTitle>Confirm App Reset?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    All screens & settings will be reset to initial state, you
                    cannot undo this action.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant={'contained'}
                    onClick={onAppReset}
                    color={'primary'}
                  >
                    Confirm
                  </Button>
                  <Button onClick={() => setIsAppResetOpened(false)}>
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
              <Button onClick={onClose} color={'primary'} variant={'contained'}>
                Close
              </Button>
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HelpDialog
