import React, { useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
import LinkIcon from '@mui/icons-material/Link'
import RunIcon from '@mui/icons-material/PlayArrow'
import RefreshIcon from '@mui/icons-material/Refresh'
import * as validation from '../../utils/validation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectUrl, updateUrl } from '../../reducers/app'
import { refresh } from '../../reducers/layout'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { styled, alpha } from '@mui/material/styles'

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  height: 40,
  width: 350,
  [theme.breakpoints.down('md')]: {
    width: 250,
  },
}))

const InputRightElement = styled(LinkIcon)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  left: theme.spacing(1.5),
}))

const InputField = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0, 6),
  height: '100%',
  width: '100%',
  borderRadius: 5,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  '&:hover:not(.Mui-disabled):before': {
    borderBottom: 'none',
  },
  '&:before': {
    borderBottom: 'none',
  },
}))

const SubmitButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1.5),
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
    if (values.url === url) {
      dispatch(refresh())
    } else {
      dispatch(updateUrl(values.url))
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputRightElement />

      <InputField
        placeholder={'https://example.com'}
        autoComplete="new-email"
        autoFocus
        {...register('url', {
          required: true,
          validate: {
            url: validation.url,
          },
        })}
      />

      <SubmitButton
        type={'submit'}
        aria-label="Refresh"
        aria-haspopup="true"
        color="inherit"
      >
        {formUrl === url && <RefreshIcon />}
        {formUrl !== url && <RunIcon />}
      </SubmitButton>
    </Form>
  )
}

export default AddressBar
