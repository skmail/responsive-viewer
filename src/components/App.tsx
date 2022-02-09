import React, { useEffect } from 'react'
import AppBar from './AppBar'
import Screens from './Screens'
import { makeStyles } from '@material-ui/core/styles'
import Sidebar from './Sidebar'
import ScreenDialog from './ScreenDialog'
import UserAgentDialog from './UserAgentDialog'
import HelpDialog from './HelpDialog'
import Tabs from './Tabs'
import TabDialog from './TabDialog'
// import Draw from './Draw'
import { initialize } from '../reducers/app'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { selectIsAppReady } from '../reducers/layout'
const useStyles = makeStyles(theme => {
  return {
    root: {
      overflow: 'hidden',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    inner: {
      display: 'flex',
      flex: 1,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'hidden',
    },
  }
})

function App() {
  const dispatch = useAppDispatch()
  const initialized = useAppSelector(selectIsAppReady)

  useEffect(() => {
    dispatch(initialize())
  }, [dispatch])

  // useEffect(() => {
  //   const onRefresh = e => {
  //     let isF5 = false
  //     let isR = false

  //     const code = e.code
  //     if (code === 'F5') {
  //       isF5 = true
  //     }

  //     if (code === 'KeyR') {
  //       isR = true
  //     }

  //     if (isF5 || ((e.ctrlKey || e.metaKey) && isR)) {
  //       e.preventDefault()
  //       refresh()
  //     }
  //   }

  //   window.addEventListener('keydown', onRefresh)

  //   return () => {
  //     window.removeEventListener('keydown', onRefresh)
  //   }
  // }, [refresh])

  const classes = useStyles()

  if (!initialized) {
    return <div>Loading ...</div>
  }

  return (
    <div className={classes.root}>
      <TabDialog />
      <ScreenDialog />
      <UserAgentDialog />

      <HelpDialog />

      <AppBar />
      {/* <Draw /> */}

      <div className={classes.inner}>
        <Sidebar />
        <div className={classes.content}>
          <Tabs />

          <Screens />
        </div>
      </div>
    </div>
  )
}

export default App
