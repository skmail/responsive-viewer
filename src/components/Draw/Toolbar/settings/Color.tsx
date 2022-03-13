import { SketchPicker } from 'react-color'
import { styled } from '@mui/material/styles'

export default styled(SketchPicker)(({ theme }) => ({
  width: '100% !important',
  background: 'none !important',
  boxShadow: 'none !important',
  padding: '0 !important',
  '& label': {
    color: `${theme.palette.text.secondary} !important`,
  },
}))
