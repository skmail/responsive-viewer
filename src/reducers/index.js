import {combineReducers} from 'redux'
import appReducer from './app'
import layoutReducer from './layout'
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  app: appReducer,
  layout: layoutReducer,
  form: formReducer
})