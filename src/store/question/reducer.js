import { Map } from 'immutable';
import { EASY, MEDIUM, DIFFICULT, QUESTION_DETAIL } from '../../../config/constant';

const initState = new Map({
  easy: [],
  medium: [],
  difficult: [],
  questionDetail: {},
});
function Question(state = initState, action) {
  switch (action.type) {
    case 0:
      return state.set('easy', action.payload);
    case 1:
      return state.set('medium', action.payload);
    case 2:
      return state.set('difficult', action.payload);
    case QUESTION_DETAIL:
      return state.set('questionDetail', ...action.payload);
    default:
      return state;
  }
}

export default Question;
