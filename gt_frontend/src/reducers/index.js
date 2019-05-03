import { combineReducers } from 'redux';
import ui from './ui';
import profile from './profile';
import entities from './entities';
import results from './results';
import userLists from './userLists';
import entries from './entries';

export default combineReducers({
  ui, profile, entities, results, userLists, entries
});
