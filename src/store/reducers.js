import { combineReducers } from 'redux-immutable';

import CurrentUser from './user/reducer';
import Socket from './socket/reducer';
const reducers = combineReducers({ CurrentUser, Socket });

export default reducers;
