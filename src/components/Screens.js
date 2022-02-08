import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import NoUrlIcon from '@material-ui/icons/LinkOff'
import NoScreensIcon from '@material-ui/icons/ViewModule'
import Screen from './Screen'
import Scrollbars from './Scrollbars'
import { useSelector } from 'react-redux'
import { getSelectedTab, getScreensByTab } from '../selectors'

const useStyles = makeStyles(theme => ({
  root: {},
  content: props => ({
    display: 'flex',
    width: `calc( (100vw - ${theme.drawerWidth}px) / ${props.zoom})`,
    flexWrap: props.viewMode === 'vertical' ? 'wrap' : 'nowrap',
    transform: `scale(${props.zoom})`,
    transformOrigin: '0 0',
    backfaceVisibility: 'hidden',
    '-webkit-font-smoothing': 'antialiased',
    position: 'relative',
  }),
  emptyState: {
    minHeight: `100%`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: 20,
    color: theme.palette.secondary.dark,
  },
  emptyStateIcon: {
    fontSize: 80,
  },
}))

const Screens = props => {
  const { url, versionedUrl, screenDirection, screenshot } = props
  const classes = useStyles(props)
  const visibleScreens = useSelector(state => {
    return getScreensByTab(state, getSelectedTab(state))
  })

  const isTakingScreenShot = useSelector(
    state => state.layout.isTakingScreenShot
  )

  if (url === '') {
    return (
      <div className={classes.emptyState}>
        <NoUrlIcon className={classes.emptyStateIcon} />
        Screens Requires a URL!
      </div>
    )
  }

  if (visibleScreens.length === 0) {
    return (
      <div className={classes.emptyState}>
        <NoScreensIcon className={classes.emptyStateIcon} />
        There are no screens to show!
      </div>
    )
  }

  return (
    <Scrollbars
      autoHide={isTakingScreenShot}
      id="screens-wrapper"
      className={classes.root}
    >
      <div className={classes.content} id={'screens'}>
        {visibleScreens.map(screen => (
          <Screen
            key={screen.id}
            screen={screen}
            screenDirection={screenDirection}
            url={url}
            versionedUrl={versionedUrl}
            screenshot={screenshot}
          />
        ))}
      </div>
    </Scrollbars>
  )
}

export default Screens
