import { combineReducers } from 'redux'
import appReducer from './app'
import layoutReducer from './layout'

export default combineReducers({
  app: appReducer,
  layout: layoutReducer,
})
