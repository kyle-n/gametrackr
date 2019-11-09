import {SET_USER_ID, SET_JWT, SET_THEME, SEND_ALERT} from './action-types';
import {getCachedGlobalState, cacheGlobalState} from './caching';

const nullState = {
  theme: 'dark',
  userId: null,
  jwt: null,
  message: {
    type: null,
    text: null
  }
}

const initialState = getCachedGlobalState() || nullState;

export function reducer(state = initialState, action) {
  let newState;

  switch (action.type) {
    case SET_USER_ID:
      newState = Object.assign({}, state, {userId: action.userId});
      break;
    case SET_JWT:
      newState = Object.assign({}, state, {jwt: action.jwt});
      break;
    case SET_THEME:
      newState = Object.assign({}, state, {theme: action.theme});
      break;
    case SEND_ALERT:
      const message = {type: action.messageType, text: action.message};
      newState = Object.assign({}, state, {message});
      break;
    default:
      newState = state;
      break;
  }

  cacheGlobalState(newState);
  return newState;
}
