import { getQuestions } from '../../services/ant-design-pro/question';
import {} from '../';

export function getQuestionAction(type) {
  return (dispatch) => {
    getQuestions(type).then((res) => {
      if (res.code) {
        dispatch({
          type: type.name,
          payload: res.data,
        });
      }
    });
  };
}
