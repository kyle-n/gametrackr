import { combineReducers } from 'redux';
import ui from './ui';
import profile from './profile';
import entities from './entities';
import results from './results';

export default combineReducers({
  ui, profile, entities, results
})