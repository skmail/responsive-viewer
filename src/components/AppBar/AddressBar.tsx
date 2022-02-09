import React, { useEffect } from 'react'
import { alpha, makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import LinkIcon from '@material-ui/icons/Link'
import RunIcon from '@material-ui/icons/PlayArrow'
import RefreshIcon from '@material-ui/icons/Refresh'
import TextField from '@material-ui/core/TextField'
import * as validation from '../../utils/validation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectUrl, updateUrl } from '../../reducers/app'
import { useAppDispatch } from '../../hooks/useAppDispatch'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
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
    width: 350,
    borderBottom: 'none',
    '& > div:before': {
      content: 'initial',
    },
    '& > div:after': {
      content: 'initial',
    },
  },
}))

const AddressBar = () => {
  const dispatch = useAppDispatch()

  const url = useAppSelector(selectUrl)

  const { register, handleSubmit, watch, setValue } = useForm({
    mode: 'onChange',
  })

  const formUrl = watch('url')

  useEffect(() => setValue('url', url), [url, setValue])

  const onSubmit: SubmitHandler<any> = values => {
    dispatch(updateUrl(values.url))
  }

  const classes = useStyles()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
      <div className={classes.linkIcon}>
        <LinkIcon />
      </div>

      <TextField
        placeholder={'https://example.com'}
        classes={{
          root: classes.inputInput,
        }}
        autoFocus
        {...register('url', {
          required: true,
          validate: {
            url: validation.url,
          },
        })}
      />

      <IconButton
        type={'submit'}
        aria-label="Refresh"
        aria-haspopup="true"
        color="inherit"
      >
        {formUrl === url && <RefreshIcon />}
        {formUrl !== url && <RunIcon />}
      </IconButton>
    </form>
  )
}

export default AddressBar
