import React from 'react'
import Input from '@mui/material/Input'
import {
  Saturation,
  ColorWrap,
  Hue,
  Alpha,
} from 'react-color/lib/components/common'
import { makeStyles } from '@mui/material/styles'
const width = 170
const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    '&> *:not(last-child)': {
      marginBottom: theme.spacing(1),
    },
  },

  saturation: {
    position: 'relative',
    height: width / 1.5,
  },
  hue: {
    height: 10,
    position: 'relative',
  },
  alpha: {
    height: 10,
    position: 'relative',
    background: '#fff',
  },
  inputs: {
    display: 'flex',
  },
  input: {
    fontSize: 12,
  },
}))

const Color = ({ hsv, hsl, rgb, onChange }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.saturation}>
        <Saturation rgb={rgb} hsl={hsl} hsv={hsv} onChange={onChange} />
      </div>
      <div className={classes.hue}>
        <Hue rgb={rgb} hsl={hsl} hsv={hsv} onChange={onChange} />
      </div>
      <div className={classes.alpha}>
        <Alpha hsl={hsl} hsv={hsv} rgb={rgb} onChange={onChange} />
      </div>

      <div className={classes.inputs}>
        <Input
          onChange={e =>
            onChange({
              ...rgb,
              r: e.target.value,
            })
          }
          className={classes.input}
          placeholder="R"
          value={rgb.r}
        />
        <Input
          onChange={e =>
            onChange({
              ...rgb,
              g: e.target.value,
            })
          }
          className={classes.input}
          placeholder="G"
          value={rgb.g}
        />
        <Input
          onChange={e =>
            onChange({
              ...rgb,
              b: e.target.value,
            })
          }
          className={classes.input}
          placeholder="B"
          value={rgb.b}
        />
      </div>
    </div>
  )
}

export default ColorWrap(Color)
