import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

type Notification = {
  type: 'success' | 'info' | 'error'
  message: string
  loading?: boolean
  cancellable?: boolean
  actions?: {
    action: PayloadAction<any>
    label: string
  }[]
}
export type State = Notification[]

const initialState: State = []

export const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notify: (state, action: PayloadAction<Notification>) => {
      return [action.payload]
    },
    removeNotification() {
      return []
    },
  },
})

export const { notify, removeNotification } = slice.actions

export const select = (state: RootState) => state.notifications
export const selectNotifications = (state: RootState) => select(state)[0]
export default slice.reducer
