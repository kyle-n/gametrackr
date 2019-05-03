import { CREATE_ENTRY, UPDATE_ENTRY, DELETE_ENTRY } from './definitions';

const entries = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ENTRY:
      const newEntryList = state[action.list_id] && state[action.list_id].slice() || [];
      newEntryList.push(action.entry);
      const newState = {};
      newState[action.list_id] = newEntryList;
      return Object.assign({}, state, newState);
    case UPDATE_ENTRY:
      const newEntry = {};
      if (action.entry.ranking) newEntry.ranking = action.entry.ranking;
      if (action.entry.text) newEntry.text = action.entry.text;
      const newList = state[action.list_id] && state[action.list_id].slice() || [];
      const i = newList.findIndex(entry => entry.id === action.entry.id);
      newList.splice(i, 1, newEntry);
      const newState = {};
      newState[action.list_id] = newList;
      return Object.assign({}, state, newState);
    case DELETE_ENTRY:
      const newList = state[action.list_id];
      const i = newList.findIndex(entry => entry.id === action.entry.id);
      newList.splice(i, 1);
      const newState = {};
      newState[action.list_id] = newList;
      return Object.assign({}, state, newState);
    default:
      return state;
  }
}

export default entries;
