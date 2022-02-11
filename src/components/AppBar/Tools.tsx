import { useState, MouseEvent, useEffect } from 'react'
import Popover from '@mui/material/Popover'
import Zoom from './Zoom'
import Screenshot from './Screenshot'
import ViewMode from './ViewMode'
import ScreenDirection from './ScreenDirection'
import Stack from '@mui/material/Stack'
import SettingsIcon from '@mui/icons-material/Settings'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const Tools = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'tools-popover' : undefined

  const onOpen = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement)
  }

  const tools = (
    <Stack spacing={2} direction="row">
      <ViewMode />
      <ScreenDirection />
      <Screenshot />
      <Zoom />
    </Stack>
  )
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('lg'))

  useEffect(() => {
    if (!isSmall) {
      setAnchorEl(null)
    }
  }, [isSmall])
  return (
    <>
      {!isSmall && tools}

      {isSmall && (
        <>
          <IconButton aria-describedby={id} onClick={onOpen}>
            <SettingsIcon />
          </IconButton>

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
            onClose={() => setAnchorEl(null)}
          >
            {tools}
          </Popover>
        </>
      )}
    </>
  )
}

export default Tools
