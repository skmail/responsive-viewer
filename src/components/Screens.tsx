import React from 'react'
import NoUrlIcon from '@mui/icons-material/LinkOff'
import NoScreensIcon from '@mui/icons-material/ViewModule'
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
import EmptyState from './EmptyState'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

interface StyledProps extends BoxProps {
  viewMode: ViewMode
  zoom: number
}
const ScreensView = styled(({ viewMode, zoom, ...rest }: StyledProps) => (
  <Box {...rest} />
))<StyledProps>(({ viewMode, zoom }) => ({
  display: 'flex',
  width: `calc( (100vw - ${250}px) / ${zoom})`,
  flexWrap: viewMode === 'vertical' ? 'wrap' : 'nowrap',
  transform: `scale(${zoom})`,
  transformOrigin: '0 0',
  backfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'antialiased',
  position: 'relative',
}))

const Screens = () => {
  const zoom = useAppSelector(selectZoom)
  const viewMode = useAppSelector(selectViewMode)

  const screens = useAppSelector(state => {
    const tab = selectTab(state, selectSelectedTab(state))
    if (!tab) {
      return []
    }
    return tab.screens
  }, shallowEqual)

  const url = useAppSelector(selectUrl)

  if (url === '') {
    return <EmptyState icon={NoUrlIcon} message="Screens Requires a URL!" />
  }

  if (screens.length === 0) {
    return (
      <EmptyState
        icon={NoScreensIcon}
        message="There are no screens to show!"
      />
    )
  }

  return (
    <Scrollbars id="screens-wrapper">
      <ScreensView viewMode={viewMode} zoom={zoom} id={'screens'}>
        {screens.map(id => (
          <Screen key={id} id={id} />
        ))}
      </ScreensView>
    </Scrollbars>
  )
}

export default Screens
