import React from 'react'
import { makeStyles, darken, fade } from '@material-ui/core/styles'
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
    background: fade(theme.palette.common.white, 0.15),
    marginRight: theme.spacing(1),
  },
  textFieldInput: {
    padding: theme.spacing(1),
  },
  active: {},
}))

const ElementInspect = props => {
  const {
    handleSubmit,
    invalid,
    search,
    inspectByMouse,
    toggleInspectByMouse,
  } = props

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
        title="Inspect element"
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
            <ToolbarButton
              title="Inspect by mouse"
              active={inspectByMouse}
              onClick={() => {
                handleClose()
                toggleInspectByMouse()
              }}
            >
              <svg
                style={{ width: 15 }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 268.71 256.02"
              >
                <path
                  d="M265.8 210.22l-59.11-59.11 42.17-24.35a9.93 9.93 0 00-1.29-17.83l-188-75a9.93 9.93 0 00-12.9 12.91l75 188.05a9.93 9.93 0 0017.83 1.29L163.81 194l59.1 59.11a9.93 9.93 0 0014.05 0l28.84-28.85a9.92 9.92 0 000-14.04zM229.94 232l-61.23-61.23a9.93 9.93 0 00-7-2.91 9.31 9.31 0 00-1.29.08 10 10 0 00-7.31 4.88L132.5 208.5 73.65 60.94 221.2 119.8l-35.65 20.59A9.92 9.92 0 00183.5 156l61.23 61.23z"
                  fill="currentColor"
                />
                <path
                  d="M73.27 181.57H26.4A26.42 26.42 0 010 155.18V26.4A26.43 26.43 0 0126.4 0h128.78a26.42 26.42 0 0126.39 26.4v23.9h-3V26.4A23.42 23.42 0 00155.18 3H26.4A23.43 23.43 0 003 26.4v128.78a23.42 23.42 0 0023.4 23.39h46.87z"
                  fill="currentColor"
                />
              </svg>
            </ToolbarButton>
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
