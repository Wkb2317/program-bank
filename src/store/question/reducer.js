import { Map } from 'immutable';
import { EASY, MEDIUM, DIFFICULT } from '../../../config/constant';

const initState = new Map({
  easy: [],
  medium: [],
  difficult: [],
});
function Question(state = initState, action) {
  switch (action.type) {
    case EASY:
      return state.set('easy', action.payload);
    case MEDIUM:
      return state.set('medium', action.payload);
    case DIFFICULT:
      return state.set('difficult', action.payload);
    default:
      return state;
  }
}

export default Question;
