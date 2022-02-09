import { Platform } from '../types'
import chrome from './chrome'
import firefox from './firefox'
import local from './local'

let platform: Platform

if (process.env.REACT_APP_PLATFORM === 'CHROME') {
  platform = chrome
} else if (process.env.REACT_APP_PLATFORM === 'FIREFOX') {
  platform = firefox
} else {
  platform = local
}

export default platform
