import { NOTIFICATION_RESET_COUNT, NOTIFICATION_ADD } from '../constants/notificationConstants'

export const resetNotificationCount = () => (dispatch) => {
  dispatch({ type: NOTIFICATION_RESET_COUNT })
}

export const addNotification = () => (dispatch) => {
  dispatch({ type: NOTIFICATION_ADD })
}