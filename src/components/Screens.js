import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ScreenIframe from './ScreenIframe'
import FormHelperText from '@material-ui/core/FormHelperText'
import { Scrollbars } from 'react-custom-scrollbars'
import { getDomId } from '../utils/screen'
import NoUrlIcon from '@material-ui/icons/LinkOff'
import NoScreensIcon from '@material-ui/icons/ViewModule'

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
    width: `calc(100% + ${100 * (1 - props.zoom)}100%)`,
    flexWrap: props.viewMode === 'vertical' ? 'wrap' : 'nowrap',
    transform: `  perspective(1px) translateZ(0) scale(${props.zoom})`,
    transformOrigin: 'top left',
    backfaceVisibility: 'hidden',
    '-webkit-font-smoothing': 'antialiased',
  }),
  screen: {
    padding: theme.spacing(2),
  },
  text: {
    marginBottom: theme.spacing(0.7),
    marginTop: 0,
  },
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
          <div
            id={getDomId(screen.id)}
            className={classes.screen}
            key={screen.id}
          >
            <Box display="flex" justifyContent="space-between">
              <FormHelperText className={classes.text}>
                {screen.name}
              </FormHelperText>

              <button onClick={() => screenshot(screen)}>Screenshot</button>
              <FormHelperText className={classes.text}>
                {screenDirection === 'landscape'
                  ? `${screen.height}x${screen.width}`
                  : `${screen.width}x${screen.height}`}
              </FormHelperText>
            </Box>
            <ScreenIframe
              screen={screen}
              url={url}
              versionedUrl={versionedUrl}
              screenDirection={screenDirection}
            />
          </div>
        ))}
      </div>
    </Scrollbars>
  )
}

export default Screens
