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
  const url = useAppSelector(selectUrl)
  const screen = useAppSelector(
    state => selectScreenById(state, id),
    shallowEqual
  )
  const isHighlighted = useAppSelector(
    state => selectHighlightedScreen(state) === id
  )
  const [isLoading, setIsLoading] = useState(true)
  const [scrolling, setScrolling] = useState(true)

  const onLoad = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
  }, [url])

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
  console.log(url)
  return (
    <Root isHighlighted={isHighlighted}>
      {isLoading && <Progress color="primary" />}

      <IframeElement
        scrolling={scrolling ? 'auto' : 'no'}
        id={getIframeId(screen.id)}
        onLoad={onLoad}
        sandbox="allow-scripts allow-forms allow-same-origin allow-presentation allow-orientation-lock allow-modals allow-popups-to-escape-sandbox allow-pointer-lock "
        title={`${screen.name} - ${width}x${height}`}
        style={{
          width,
          height,
        }}
        src={url}
      />
    </Root>
  )
}

export default Iframe
