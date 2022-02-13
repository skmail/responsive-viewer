import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Toolbar from './Toolbar'
import { styled } from '@mui/material/styles'
import Header from './Header'
import DialogWrapper from './DialogWrapper'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { closeDraw, selectIsDrawOpen } from '../../reducers/draw'
import { StageProvider } from './contexts/StageProvider'
const Content = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  height: 100,
  overflow: 'hidden',
}))

const DrawDialog = () => {
  const dispatch = useAppDispatch()
  const open = useAppSelector(selectIsDrawOpen)
  const handleClose = () => {
    dispatch(closeDraw())
  }
  const id = 'draw-app'

  return (
    <Dialog fullScreen id={id} open={open} onClose={handleClose}>
      <StageProvider>
        <Header onClose={handleClose} />
        <Content>
          <DialogWrapper />
          <Toolbar />
        </Content>
      </StageProvider>
    </Dialog>
  )
}

export default DrawDialog
