import * as types from '../../../config/constant';
import { Map } from 'immutable';
const initStore = new Map({
  socket: null,
  allMessage: [],
});
export default function (store = initStore, action) {
  switch (action.type) {
    case types.CHANGE_SOCKET:
      return store.set('socket', action.payload);
    case types.ALL_MESSAGE:
      return store.set('allMessage', action.payload);
    default:
      return store;
  }
}
