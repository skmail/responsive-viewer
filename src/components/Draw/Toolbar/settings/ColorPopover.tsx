import { ReactNode, useState, MouseEvent } from 'react'
import MuiPopover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import Color from './Color'
import { styled } from '@mui/material/styles'
import { ColorChangeHandler, Color as ColorType } from 'react-color'
const width = 170
const Popover = styled(MuiPopover)(({ theme }) => ({
  '& .MuiPaper-root': {
    width,
    padding: theme.spacing(1),
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
  },
}))
interface Props {
  color?: ColorType
  onChange: ColorChangeHandler
  children: ReactNode
}
const ColorPopover = ({ color, onChange, children }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const id = open ? 'color-popover' : undefined

  return (
    <>
      <Button aria-describedby={id} onClick={handleClick}>
        {children}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Color color={color} onChange={onChange} />
      </Popover>
    </>
  )
}

export default ColorPopover
