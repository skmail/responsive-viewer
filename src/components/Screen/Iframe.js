import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { getIframeId } from '../../utils/screen'
import classNames from 'classnames'
import appendQuery from 'append-query'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    transition: 'all ease 0.5s',
  },
  highlighted: {
    boxShadow: `0 0 0 4px ${theme.palette.primary.main}`,
    transform: 'scale(1.02)',
    transition: 'all ease 0.5s',
  },
  iframe: {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: 2,
    display: 'block',
  },
  progress: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
}))

const Iframe = props => {
  const { screen, versionedUrl, screenDirection } = props
  const [isLoading, setIsLoading] = useState(true)
  const [scrolling, setScrolling] = useState(true)

  const classes = useStyles()

  const iframeUrl = appendQuery(versionedUrl, {
    _RSSID_: screen.id,
  })

  const onLoad = e => {
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
  }, [iframeUrl, screen.timestamp])

  useEffect(() => {
    let isShift = false

    const up = () => {
      if (!isShift) {
        return
      }
      isShift = false
      setScrolling(true)
    }

    const down = e => {
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
    <div
      className={classNames(
        classes.root,
        screen.highlighted ? classes.highlighted : null
      )}
    >
      {isLoading && (
        <div className={classes.progress}>
          <LinearProgress color="secondary" />
        </div>
      )}

      <iframe
        scrolling={scrolling ? 'auto' : 'no'}
        id={getIframeId(screen.id)}
        onLoad={onLoad}
        className={classes.iframe}
        sandbox="allow-scripts allow-forms allow-same-origin allow-presentation allow-orientation-lock allow-modals allow-popups-to-escape-sandbox allow-pointer-lock "
        key={`screen-${screen.timestamp}`}
        title={`${screen.name} - ${width}x${height}`}
        style={{
          width,
          height,
        }}
        src={iframeUrl}
      />
    </div>
  )
}

export default Iframe
