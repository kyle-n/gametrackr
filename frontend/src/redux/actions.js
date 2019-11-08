import {SEND_ALERT, SET_THEME, SET_JWT, SET_USER_ID} from './action-types';

export function setTheme(theme) {
  return {type: SET_THEME, theme};
}

export function setJwt(jwt) {
  return {type: SET_JWT, jwt};
}

export function setUserId(userId) {
  return {type: SET_USER_ID, userId};
}

export function sendAlert(message, messageType) {
  return {type: SEND_ALERT, message, messageType};
}
