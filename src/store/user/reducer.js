import { Map } from 'immutable';

const initState = new Map({
  currentUser: {},
});
function UserReducer(state = initState, action) {
  switch (action.type) {
    case 'currentUser':
      return state.set('currentUser', action.payload);
    default:
      return state;
  }
}

export default UserReducer;
