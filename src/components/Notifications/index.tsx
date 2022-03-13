import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import {
  removeNotification,
  selectNotifications,
} from '../../reducers/notifications'
import { useMemo } from 'react'

const Alert = styled(MuiAlert)(({ theme }) => ({
  alignItems: 'center',
  '& > .MuiAlert-message': {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  '& > .MuiAlert-action': {
    padding: 0,
  },
}))

export default function Notifications() {
  const notification = useAppSelector(selectNotifications)
  const open = Boolean(notification)
  const dispatch = useAppDispatch()

  const handleClose = useMemo(() => {
    if (!notification || notification.cancellable === false) {
      return
    }

    return () => {
      dispatch(removeNotification())
    }
  }, [notification, dispatch])

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
    >
      <Alert
        icon={
          notification?.loading ? <CircularProgress size={18} /> : undefined
        }
        variant="filled"
        severity={notification?.type}
        onClose={handleClose}
      >
        {open && (
          <Stack
            alignItems={'center'}
            spacing={2}
            direction="row"
            justifyContent="space-between"
          >
            <span>{notification.message}</span>
            <Box>
              {!!notification.actions &&
                notification.actions.map(action => (
                  <Button
                    key={action.label}
                    onClick={() => dispatch(action.action)}
                    size="small"
                  >
                    {action.label}
                  </Button>
                ))}
            </Box>
          </Stack>
        )}
      </Alert>
    </Snackbar>
  )
}
