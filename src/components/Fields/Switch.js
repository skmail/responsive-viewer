import React from 'react'
import Switch from '@material-ui/core/Switch'
import { Field } from 'redux-form'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  switchBase: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
    '&$checked + $track': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  checked: {},
  track: {},
}))

const RenderSwitch = ({ input, label }) => {
  const classes = useStyles()

  return (
    <FormControlLabel
      value={input.value}
      labelPlacement="end"
      label={label}
      control={
        <Switch
          classes={{
            root: classes.root,
            switchBase: classes.switchBase,
            thumb: classes.thumb,
            track: classes.track,
            checked: classes.checked,
          }}
          label={label}
          checked={!!input.value}
          onChange={e => input.onChange(e.target.checked)}
        />
      }
    />
  )
}

export default props => <Field component={RenderSwitch} {...props} />
