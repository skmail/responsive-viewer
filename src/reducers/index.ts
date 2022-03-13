import { combineReducers } from 'redux'
import app from './app'
import layout from './layout'
import runtime from './runtime'
import notifications from './notifications'
import screenshots from './screenshots'
import draw from './draw'

export default combineReducers({
  app,
  layout,
  runtime,
  notifications,
  screenshots,
  draw,
})
