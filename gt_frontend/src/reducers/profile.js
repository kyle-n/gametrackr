import { SET_USER_DATA, LOG_OUT } from './definitions';

const defaultState = {
  email: '',
  id: undefined,
  token: ''
}

const profile = function profile(state = defaultState, action) {
  switch (action.type) {
    case SET_USER_DATA:
      return Object.assign({}, { email: action.email, id: action.id, token: action.token });
    case LOG_OUT:
      return Object({}, defaultState);
    default:
      return state;
  }
}