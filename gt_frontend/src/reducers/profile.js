import { SET_USER_DATA, LOG_OUT, AVAILABLE_EMAIL } from './definitions';

const defaultState = {
  email: '',
  id: undefined,
  token: '',
  availableEmail: undefined
}

const profile = function profile(state = defaultState, action) {
  switch (action.type) {
    case SET_USER_DATA:
      return Object.assign({}, { email: action.email, id: action.id, token: action.token });
    case LOG_OUT:
      return Object({}, defaultState);
    case AVAILABLE_EMAIL:
      return Object.assign({}, state, { availableEmail: action.email });
    default:
      return state;
  }
}

export default profile;
