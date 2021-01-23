import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'
import theme from './theme'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'

const store = configureStore()

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('RESPONSIVE-VIEWER-ROOT')
)
