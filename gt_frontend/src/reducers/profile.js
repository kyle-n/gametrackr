import { SET_USER_DATA, LOG_OUT, AVAILABLE_EMAIL } from './definitions';

const cacheName = 'gt_profile';

let defaultState;
const cachedState = localStorage.getItem(cacheName);
if (cachedState) defaultState = JSON.parse(cachedState);
else defaultState = {
  email: '',
  id: undefined,
  token: ''
};

const profile = function profile(state = defaultState, action) {
  switch (action.type) {
    case SET_USER_DATA:
      const newState = Object.assign({}, { email: action.email, id: action.id, token: action.token });
      localStorage.setItem(cacheName, JSON.stringify(newState));
      return newState;
    case LOG_OUT:
      localStorage.removeItem(cacheName);
      return Object({}, defaultState);
    default:
      return state;
  }
}

export default profile;
