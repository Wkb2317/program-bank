import { combineReducers } from 'redux-immutable';

import CurrentUser from './user/reducer';
import Socket from './socket/reducer';
import Question from './question/reducer';

const reducers = combineReducers({ CurrentUser, Socket, Question });

export default reducers;
