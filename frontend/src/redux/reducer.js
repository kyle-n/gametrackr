import {SET_USER_ID, SET_JWT, SET_THEME} from './action-types';
import {getCachedGlobalState, cacheGlobalState} from './caching';

const initialState = getCachedGlobalState() || {
  theme: 'dark',
  userId: null,
  jwt: null
};

export function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_USER_ID:
      newState = Object.assign({}, state, {userId: action.userId});
      cacheGlobalState(newState);
      return newState;
    case SET_JWT:
      newState = Object.assign({}, state, {jwt: action.jwt});
      cacheGlobalState(newState);
      return newState;
    case SET_THEME:
      newState = Object.assign({}, state, {theme: action.theme});
      cacheGlobalState(newState);
      return newState;
    default:
      return state;
  }
}
