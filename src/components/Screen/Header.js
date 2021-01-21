import React from 'react'
import Box from '@material-ui/core/Box'
import FormHelperText from '@material-ui/core/FormHelperText'
import classNames from 'classnames'
import { fade, makeStyles } from '@material-ui/core/styles'
import Screenshot from './Actions/Screenshot'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 2,
  },
  title: {
    margin: 0,
    fontWeight: 700,
  },
  size: {
    margin: 0,
    marginLeft: theme.spacing(1),
    fontWeight: 300,
    fontSize: 12,
    borderRadius: 3,
    color: fade(theme.palette.secondary.light, 0.6),
  },
  action: {
    color: theme.palette.secondary.light,
  },
}))
const Header = props => {
  const { screen, screenshot, screenDirection } = props

  const classes = useStyles()

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems={'center'}
      className={classes.root}
    >
      <Box display={'flex'} alignItems={'center'}>
        <FormHelperText className={classes.title}>{screen.name}</FormHelperText>
        <FormHelperText className={classNames(classes.size)}>
          {screenDirection === 'landscape'
            ? `${screen.height}x${screen.width}`
            : `${screen.width}x${screen.height}`}
        </FormHelperText>
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        <Screenshot screenshot={screenshot} classes={classes} screen={screen} />
      </Box>
    </Box>
  )
}

export default Header
