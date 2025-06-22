import { NOTIFICATION_RESET_COUNT, NOTIFICATION_ADD } from '../constants/notificationConstants'

export const notificationReducer = (state = { unreadCount: 0 }, action) => {
  switch (action.type) {
    case NOTIFICATION_ADD:
      return {
        ...state,
        unreadCount: state.unreadCount + 1,
      }
    case NOTIFICATION_RESET_COUNT:
      return {
        ...state,
        unreadCount: 0,
      }
    default:
      return state
  }
}