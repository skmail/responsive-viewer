import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { styled, alpha, lighten } from '@mui/material/styles'

const ChromeBox = styled('a')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: 15,
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  width: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all ease 0.2s',
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
  },
}))

const ChromeIcon = styled('svg')(({ theme }) => ({
  marginRight: theme.spacing(1),
}))

const ChromeHint = styled('div')(({ theme }) => ({
  fontSize: 12,
  color: lighten(theme.palette.background.default, 0.5),
}))

const LocalWarning = () => {
  const isLocal = process.env.REACT_APP_PLATFORM === 'LOCAL'

  const [isOpened, setIsOpened] = useState(isLocal)

  const id = isOpened ? 'local-wraning-dialog' : undefined

  const onClose = () => {
    setIsOpened(false)
  }

  const extensionUrl =
    'https://chrome.google.com/webstore/detail/responsive-viewer/inmopeiepgfljkpkidclfgbgbmfcennb?hl=en'

  return (
    <div>
      <Dialog id={id} open={isOpened} onClose={onClose}>
        <DialogTitle>Limited functionality!</DialogTitle>
        <DialogContent>
          <div>
            <DialogContentText>
              The responsive viewer website is a preview mode only and has
              limited functionality, to unlock full capablities of the app,
              please install the chrome extension, for free!
            </DialogContentText>

            <div>
              <ChromeBox href={extensionUrl} target="_blank">
                <ChromeIcon
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                >
                  <path
                    fill="#4caf50"
                    d="M44 24c0 11.044-8.956 20-20 20S4 35.044 4 24 12.956 4 24 4s20 8.956 20 20z"
                  />
                  <path
                    fill="#ffc107"
                    d="M24 4v20l8 4-8.843 16H24c11.053 0 20-8.947 20-20S35.053 4 24 4z"
                  />
                  <path
                    fill="#4caf50"
                    d="M44 24c0 11.044-8.956 20-20 20S4 35.044 4 24 12.956 4 24 4s20 8.956 20 20z"
                  />
                  <path
                    fill="#ffc107"
                    d="M24 4v20l8 4-8.843 16H24c11.053 0 20-8.947 20-20S35.053 4 24 4z"
                  />
                  <path
                    fill="#f44336"
                    d="M41.84 15H24v13l-3-1L7.16 13.26h-.02C10.68 7.69 16.91 4 24 4c7.8 0 14.55 4.48 17.84 11z"
                  />
                  <path
                    fill="#dd2c00"
                    d="m7.158 13.264 8.843 14.862L21 27 7.158 13.264z"
                  />
                  <path
                    fill="#558b2f"
                    d="m23.157 44 8.934-16.059L28 25l-4.843 19z"
                  />
                  <path
                    fill="#f9a825"
                    d="M41.865 15H24l-1.579 4.58L41.865 15z"
                  />
                  <path
                    fill="#fff"
                    d="M33 24c0 4.969-4.031 9-9 9s-9-4.031-9-9 4.031-9 9-9 9 4.031 9 9z"
                  />
                  <path
                    fill="#2196f3"
                    d="M31 24c0 3.867-3.133 7-7 7s-7-3.133-7-7 3.133-7 7-7 7 3.133 7 7z"
                  />
                </ChromeIcon>

                <div>
                  Available on Chrome store
                  <ChromeHint>Installed by 90,000+ users</ChromeHint>
                </div>
              </ChromeBox>
            </div>
            <DialogActions>
              <Button onClick={onClose}>Close</Button>
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LocalWarning
