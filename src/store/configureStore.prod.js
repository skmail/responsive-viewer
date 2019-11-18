import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers'
import saga from './saga'
import { createLogger } from 'redux-logger'
const sagaMiddleware = createSagaMiddleware()

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware)
  )

  sagaMiddleware.run(saga)

  return store
}

export default configureStore
