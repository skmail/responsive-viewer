import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { useAppSelector } from '../hooks/useAppSelector'
import { selectHelpDialog, toggleHelpDialog } from '../reducers/layout'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { appReset } from '../reducers/app'

const HelpDialog = () => {
  const [isAppResetOpened, setIsAppResetOpened] = useState(false)

  const helpDialog = useAppSelector(selectHelpDialog)
  const dispatch = useAppDispatch()

  const id = helpDialog.open ? 'help-dialog' : undefined

  const onClose = () => {
    dispatch(toggleHelpDialog())
  }
  const onAppReset = () => {
    dispatch(appReset())
    setIsAppResetOpened(false)
    onClose()
  }

  return (
    <div>
      <Dialog id={id} open={helpDialog.open} onClose={onClose}>
        <DialogTitle>Help!</DialogTitle>
        <DialogContent>
          <div>
            <DialogContentText>
              Edit Screen by <Chip size="small" label={'double click'} /> on the
              screen name from sidebar.
            </DialogContentText>

            <DialogContentText>
              Hold <Chip size="small" label={'shift'} /> while scrolling to
              disable iframe scroll.
            </DialogContentText>

            <DialogActions>
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
