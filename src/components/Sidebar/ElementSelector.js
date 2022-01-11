import React from 'react'
import { makeStyles, darken, alpha } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import ToolbarButton from './ToolbarButton'
import TextField from '../Fields/Text'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import { reduxForm } from 'redux-form'
import * as validation from '../../utils/validation'

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
  paper: {
    background: darken(theme.palette.background.default, 0.15),
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
  },
  textField: {
    background: alpha(theme.palette.common.white, 0.15),
    marginRight: theme.spacing(1),
  },
  textFieldInput: {
    padding: theme.spacing(1),
  },
  active: {},
}))

const ElementInspect = props => {
  const { handleSubmit, invalid, search } = props

  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'element-selector-popover' : undefined

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
    <div>
      <ToolbarButton
        title="Elements Search"
        active={open}
        onClick={handleClick}
      >
        {searchIcon}
      </ToolbarButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        classes={{ paper: classes.paper }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <form onSubmit={handleSubmit(values => search(values.selector))}>
          <Box display="flex" alignItems="center">
            <TextField
              validationError={false}
              name="selector"
              variant="outlined"
              color="primary"
              placeholder="#app"
              classes={{
                root: classes.textField,
              }}
              validate={[validation.required]}
              inputProps={{
                className: classes.textFieldInput,
              }}
            />
            <IconButton type="submit" disabled={invalid}>
              {searchIcon}
            </IconButton>
          </Box>
        </form>
      </Popover>
    </div>
  )
}

export default reduxForm({
  form: 'ELEMENT_INSPECT',
  enableReinitialize: true,
})(ElementInspect)
