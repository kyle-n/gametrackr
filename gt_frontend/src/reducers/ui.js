import { SET_LOADING } from './definitions';

const defaultState = {
  loading: false,
}
const ui = function ui(state = defaultState, action) {
  switch (action.type) {
    case SET_LOADING:
      return Object.assign({}, state, { loading: action.isLoading });
    default:
      return state;
  }
}

export default ui;
