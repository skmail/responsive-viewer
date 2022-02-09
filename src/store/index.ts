import { configureStore } from '@reduxjs/toolkit'
import saga from './saga'
import createSagaMiddleware from 'redux-saga'

import rootReducer from '../reducers'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
})

sagaMiddleware.run(saga)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
