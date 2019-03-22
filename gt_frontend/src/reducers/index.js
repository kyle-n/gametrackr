import { combineReducers } from 'redux';
import ui from './ui';
import profile from './profile';
import entities from './entities';

export default combineReducers({
  ui, profile, entities
})