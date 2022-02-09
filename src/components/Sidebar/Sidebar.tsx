import React from 'react'
import MuiDrawer from '@mui/material/Drawer'
import Screens from './Screens'
import Toolbar from './Toolbar'
import Advertisement from '../Advertisement'
import { styled } from '@mui/material/styles'
const Drawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiPaper-root': {
    position: 'relative',
    width: 223,
  },
}))

const Sidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left" open={true}>
      <Advertisement />

      <Toolbar />

      <Screens />
    </Drawer>
  )
}

export default Sidebar
