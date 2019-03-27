import { SET_LIST } from "./definitions";

const userLists = (state = {}, action) => {
  switch (action.type) {
    case SET_LIST:
      let update = {};
      update[action.id] = action.id;
      return Object.assign({}, state, update);
    default:
      return state;
  }
};

export default userLists;
