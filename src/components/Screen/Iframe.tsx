import React, { useState, useEffect } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { getIframeId } from '../../utils/screen'
import { useAppSelector } from '../../hooks/useAppSelector'
import {
  selectScreenById,
  selectScreenDirection,
  selectUrl,
} from '../../reducers/app'
import { selectHighlightedScreen } from '../../reducers/layout'
import { styled } from '@mui/material/styles'
import { shallowEqual } from 'react-redux'
import {
  selectIsScreenLoading,
  selectRuntimeFrameStatus,
} from '../../reducers/runtime'
import { FrameStatus } from '../../types'
interface Props {
  id: string
}

interface RootProps extends BoxProps {
  isHighlighted: boolean
}
const Root = styled(({ isHighlighted, ...rest }: RootProps) => (
  <Box {...rest} />
))<RootProps>(({ theme, isHighlighted }) => ({
  position: 'relative',
  transition: 'all ease 0.5s',
  boxShadow: isHighlighted
    ? `0 0 0 4px ${theme.palette.primary.main}`
    : undefined,
  transform: isHighlighted ? 'scale(1.02)' : undefined,
}))

const IframeElement = styled('iframe')(() => ({
  backgroundColor: '#fff',
  border: 'none',
  borderRadius: 2,
  display: 'block',
}))

const Progress = styled(LinearProgress)(() => ({
  position: 'absolute',
  top: 0,
  width: '100%',
}))

const Iframe = ({ id }: Props) => {
  const screenDirection = useAppSelector(selectScreenDirection)
  const screen = useAppSelector(
    state => selectScreenById(state, id),
    shallowEqual
  )

  const isHighlighted = useAppSelector(
    state => selectHighlightedScreen(state) === id
  )
  const isLoading = useAppSelector(state => selectIsScreenLoading(state, id))

  const [scrolling, setScrolling] = useState(true)

  const url = useAppSelector(state => {
    const frameStatus = selectRuntimeFrameStatus(state, id)
    if (frameStatus === FrameStatus.IDLE) {
      return `about:blank?screenId=${screen.id}`
    }
    return selectUrl(state)
  })

  // const url =
  useEffect(() => {
    let isShift = false

    const up = () => {
      if (!isShift) {
        return
      }
      isShift = false
      setScrolling(true)
    }

    const down = (e: KeyboardEvent) => {
      if (!e.shiftKey) {
        return
      }
      isShift = true
      setScrolling(false)
    }

    document.addEventListener('keyup', up)
    document.addEventListener('keydown', down)

    return () => {
      document.removeEventListener('keydown', down)
      document.removeEventListener('keyup', up)
    }
  }, [])

  const width = screenDirection === 'landscape' ? screen.height : screen.width
  const height = screenDirection === 'landscape' ? screen.width : screen.height

  return (
    <Root isHighlighted={isHighlighted}>
      {isLoading && <Progress color="primary" />}
      <IframeElement
        scrolling={scrolling ? 'auto' : 'no'}
        id={getIframeId(screen.id)}
        sandbox="allow-scripts allow-forms allow-same-origin allow-presentation allow-orientation-lock allow-modals allow-popups-to-escape-sandbox allow-pointer-lock "
        title={`${screen.name} - ${width}x${height}`}
        sx={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        src={url}
      />
    </Root>
  )
}

export default Iframe
