import { onRefresh as onRefresh_ } from '../../utils/onRefresh'
import { sendMessage } from './sendMessage'

export const onRefresh = () => {
  onRefresh_(() => {
    sendMessage('REFRESH')

    window.location.reload()
  })
}

export const refresh = () => {
  window.location.reload()
}
