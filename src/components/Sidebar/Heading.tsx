import React, { ReactNode } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    textTransform: 'uppercase',
    fontSize: 12,
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.dark,
  },
}))

interface Props {
  children: ReactNode
}
export const Heading = ({ children }: Props) => {
  const classes = useStyles()

  return (
    <Typography variant={'subtitle2'} className={classes.root}>
      {children}
    </Typography>
  )
}

export default Heading
