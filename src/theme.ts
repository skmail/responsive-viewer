import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    // secondary: {
    //   main: '#adadad',
    // },
    // background: {
    //   paper: '#303030',
    // },
    primary: {
      main: '#FFC400',
    },
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          backgroundColor: 'transparent',
          borderRadius: '100%',
          border: 'none',
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          },
        }),
      },
    },
  },
})

export default theme
