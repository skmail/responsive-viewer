import DialogToolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'

import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import Navigation from './Navigation'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { selectSelectedPage } from '../../../reducers/draw'
import Download from './Download'

const Root = styled(AppBar)(({ theme }) => ({
  position: 'relative',
}))

interface Props {
  onClose: () => void
}

const Header = ({ onClose }: Props) => {
  const pageName = useAppSelector(state => selectSelectedPage(state)?.name)
  return (
    <Root>
      <DialogToolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="div">
          Edit screenshots ({pageName})
        </Typography>
        <Stack spacing={2} direction="row" sx={{ marginLeft: 'auto' }}>
          <Navigation />
          <Download />
        </Stack>
      </DialogToolbar>
    </Root>
  )
}

export default Header
