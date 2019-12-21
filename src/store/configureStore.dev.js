import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
// import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'
import saga from './saga'

const sagaMiddleware = createSagaMiddleware()

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(
        // createLogger(),
        sagaMiddleware
      ),
      typeof window === 'object' &&
        typeof window.devToolsExtension !== 'undefined'
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : compose
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(rootReducer)
    })
  }

  sagaMiddleware.run(saga)

  return store
}

export default configureStore
