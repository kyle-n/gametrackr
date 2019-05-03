import { SET_REVIEW, PROCESS_SEARCH_RESULTS, SET_LIST } from './definitions';
import { combineReducers } from 'redux';

const reviews = function reviews(state = {}, action) {
  switch (action.type) {
    case SET_REVIEW:
      return Object.assign({}, state, action.review);
    default:
      return state;
  }
};

const games = function games(state = {}, action) {
  switch (action.type) {
    case PROCESS_SEARCH_RESULTS:
      const newGames = {};
      action.results.forEach(r => newGames[r.id] = r);
      return Object.assign({}, state, newGames);
    default:
      return state;
  }
};

const entities = combineReducers({
  reviews, games, lists
});

export default entities;
