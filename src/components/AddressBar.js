import React from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import { reduxForm } from 'redux-form'
import IconButton from '@material-ui/core/IconButton'
import LinkIcon from '@material-ui/icons/Link'
import RunIcon from '@material-ui/icons/PlayArrow'
import RefreshIcon from '@material-ui/icons/Refresh'
import TextField from './Fields/Text'
import * as validation from '../utils/validation'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    height: 40,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  linkIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputInput: {
    color: 'inherit',
    padding: theme.spacing(0, 1, 0, 7),
    width: 500,
    borderBottom: 'none',
    '& > div:before': {
      content: 'initial',
    },
    '& > div:after': {
      content: 'initial',
    },
  },
}))

const AddressBar = props => {
  const { handleSubmit, onSubmit, pristine, invalid } = props
  const classes = useStyles()
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
      <div className={classes.linkIcon}>
        <LinkIcon />
      </div>

      <TextField
        showError={false}
        name="url"
        placeholder={'https://example.com'}
        validate={[validation.required, validation.url]}
        classes={{
          root: classes.inputInput + ' ' + classes.inputRoot,
        }}
      />

      <IconButton
        type={'submit'}
        disabled={invalid}
        aria-label="Refresh"
        aria-haspopup="true"
        color="inherit"
      >
        {pristine && <RefreshIcon />}
        {!pristine && <RunIcon />}
      </IconButton>
    </form>
  )
}

export default reduxForm({
  form: 'ADDRESS_BAR',
  enableReinitialize: true,
})(AddressBar)
