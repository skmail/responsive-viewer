import { createTheme } from '@material-ui/core/styles'

export default createTheme({
  palette: {
    type: 'dark',
    secondary: {
      main: '#adadad',
    },
    background: {
      paper: '#303030',
    },
    primary: {
      main: '#FFC400',
    },
    danger: {
      main: '#E53E3E',
      light: '#F56565',
      dark: '#742A2A',
      contrastText: '#fff',
    },
  },
  drawerWidth: 240,
  shadows: new Array(25).fill('none'),
})
