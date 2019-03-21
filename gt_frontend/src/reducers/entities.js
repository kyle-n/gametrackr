import { SET_REVIEW } from './definitions';
import { combineReducers } from 'redux';

const reviews = function reviews(state = {}, action) {
  switch (action.type) {
    case SET_REVIEW:
      return Object.assign({}, state, action.review);
    default:
      return state;
  }
}

const entries = combineReducers(reviews);