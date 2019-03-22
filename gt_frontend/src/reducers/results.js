import { PROCESS_SEARCH_RESULTS } from './definitions';

const results = function results(state = [], action) {
  switch (action.type) {
    case PROCESS_SEARCH_RESULTS:
      return action.results.map(r => r.id);
    default:
      return state;
  }
}

export default results;
