import { combineReducers } from 'redux';
import ui from './ui';
import profile from './profile';

export default combineReducers(ui, profile);