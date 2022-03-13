import { sendMessage } from './sendMessage'
const getScrollHeight = () => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  )
}

const getScrollWidth = () => {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.body.clientWidth,
    document.documentElement.clientWidth
  )
}
export default function dimensions(data = {}) {
  sendMessage('DIMENSIONS', {
    ...data,
    height: getScrollHeight(),
    width: getScrollWidth(),
  })
}
