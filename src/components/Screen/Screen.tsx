import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getDomId } from '../../utils/screen'
import Iframe from './Iframe'
import Header from './Header'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))

interface Props {
  id: string
}
const Screen = ({ id }: Props) => {
  const classes = useStyles()

  const domId = useMemo(() => getDomId(id), [id])

  return (
    <div id={domId} className={classes.root}>
      <Header id={id} />
      <Iframe id={id} />
    </div>
  )
}

export default Screen
