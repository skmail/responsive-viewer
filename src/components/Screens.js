import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Scrollbars } from 'react-custom-scrollbars'
import NoUrlIcon from '@material-ui/icons/LinkOff'
import NoScreensIcon from '@material-ui/icons/ViewModule'
import Screen from './Screen'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    [theme.breakpoints.up('sm')]: {
      minHeight: `calc(100vh - ${
        theme.mixins.toolbar[theme.breakpoints.up('sm')].minHeight
      }px)`,
    },
  },
  content: props => ({
    display: 'flex',
    width: `calc( (100vw - ${theme.drawerWidth}px) / ${props.zoom})`,
    flexWrap: props.viewMode === 'vertical' ? 'wrap' : 'nowrap',
    transform: `scale(${props.zoom})`,
    transformOrigin: '0 0',
    backfaceVisibility: 'hidden',
    '-webkit-font-smoothing': 'antialiased',
  }),
  emptyState: {
    minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    [theme.breakpoints.up('sm')]: {
      minHeight: `calc(100vh - ${
        theme.mixins.toolbar[theme.breakpoints.up('sm')].minHeight
      }px)`,
    },
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
  const { screens, url, versionedUrl, screenDirection, screenshot } = props
  const classes = useStyles(props)

  if (url === '') {
    return (
      <div className={classes.emptyState}>
        <NoUrlIcon className={classes.emptyStateIcon} />
        Screens Requires a URL!
      </div>
    )
  }

  const visibleScreens = screens.filter(screen => screen.visible)

  if (visibleScreens.length === 0) {
    return (
      <div className={classes.emptyState}>
        <NoScreensIcon className={classes.emptyStateIcon} />
        There are no screens to show!
      </div>
    )
  }

  return (
    <Scrollbars className={classes.root}>
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
