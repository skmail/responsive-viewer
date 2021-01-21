import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getDomId } from '../../utils/screen'
import Iframe from './Iframe'
import Header from './Header'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))

const Screen = props => {
  const { screen, screenDirection, url, versionedUrl, screenshot } = props

  const classes = useStyles()

  return (
    <div id={getDomId(screen.id)} className={classes.root} key={screen.id}>
      <Header
        screen={screen}
        screenshot={screenshot}
        screenDirection={screenDirection}
      />
      <Iframe
        screen={screen}
        url={url}
        versionedUrl={versionedUrl}
        screenDirection={screenDirection}
      />
    </div>
  )
}

export default Screen
