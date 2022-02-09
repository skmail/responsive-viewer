import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import NoUrlIcon from '@material-ui/icons/LinkOff'
import NoScreensIcon from '@material-ui/icons/ViewModule'
import Screen from './Screen'
import Scrollbars from './Scrollbars'
import { shallowEqual } from 'react-redux'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  selectSelectedTab,
  selectTab,
  selectUrl,
  selectViewMode,
  selectZoom,
} from '../reducers/app'
import { ViewMode } from '../types'

const useStyles = makeStyles(theme => ({
  root: {},
  content: ({ zoom, viewMode }: { zoom: number; viewMode: ViewMode }) => ({
    display: 'flex',
    width: `calc( (100vw - ${250}px) / ${zoom})`,
    flexWrap: viewMode === 'vertical' ? 'wrap' : 'nowrap',
    transform: `scale(${zoom})`,
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

const Screens = () => {
  const zoom = useAppSelector(selectZoom)
  const viewMode = useAppSelector(selectViewMode)
  const classes = useStyles({ zoom, viewMode })

  const screens = useAppSelector(state => {
    const tab = selectTab(state, selectSelectedTab(state))
    if (!tab) {
      return []
    }
    return tab.screens
  }, shallowEqual)

  const url = useAppSelector(selectUrl)

  if (url === '') {
    return (
      <div className={classes.emptyState}>
        <NoUrlIcon className={classes.emptyStateIcon} />
        Screens Requires a URL!
      </div>
    )
  }

  if (screens.length === 0) {
    return (
      <div className={classes.emptyState}>
        <NoScreensIcon className={classes.emptyStateIcon} />
        There are no screens to show!
      </div>
    )
  }

  return (
    <Scrollbars id="screens-wrapper" className={classes.root}>
      <div className={classes.content} id={'screens'}>
        {screens.map(id => (
          <Screen key={id} id={id} />
        ))}
      </div>
    </Scrollbars>
  )
}

export default Screens
