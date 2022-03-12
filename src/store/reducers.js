import { combineReducers } from 'redux-immutable';

import CurrentUser from './user/reducer';
const reducers = combineReducers({ CurrentUser });

export default reducers;
