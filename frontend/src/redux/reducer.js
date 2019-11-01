import {SET_USER_ID, SET_JWT, SET_THEME} from './action-types';

const initialState = {
  theme: 'dark',
  userId: null,
  jwt: null
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_ID:
      return Object.assign({}, state, {userId: action.userId});
    case SET_JWT:
      return Object.assign({}, state, {jwt: action.jwt});
    case SET_THEME:
      return Object.assign({}, state, {theme: action.theme});
    default:
      return state;
  }
}
