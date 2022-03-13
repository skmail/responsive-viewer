import React, { useState, MouseEvent } from 'react'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { searchElement } from '../../reducers/layout'
import Tooltip from '@mui/material/Tooltip'

const ElementInspect = ({
  tooltipPlacement,
}: {
  tooltipPlacement: 'right' | 'bottom'
}) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      selector: '',
    },
  })

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onSubmit: SubmitHandler<{ selector: string }> = values => {
    dispatch(searchElement(values.selector))
  }

  const open = Boolean(anchorEl)
  const id = 'element-selector-popover'

  const searchIcon = (
    <svg
      style={{ width: 15 }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56.966 56.966"
    >
      <path
        d="M55.146 51.887L41.588 37.786c3.486-4.144 5.396-9.358 5.396-14.786 0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837 1.192-1.147 1.23-3.049.083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z"
        fill="currentColor"
      />
    </svg>
  )

  return (
    <>
      <Tooltip arrow placement={tooltipPlacement} title="Element search">
        <IconButton aria-describedby={id} onClick={handleClick} size="small">
          {searchIcon}
        </IconButton>
      </Tooltip>

      <Popover
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            size="small"
            variant="outlined"
            color="primary"
            placeholder="#app"
            {...register('selector', {
              required: true,
            })}
            InputProps={{
              endAdornment: (
                <IconButton type="submit" disabled={!isValid}>
                  {searchIcon}
                </IconButton>
              ),
            }}
            autoFocus
          />
        </form>
      </Popover>
    </>
  )
}

export default ElementInspect
