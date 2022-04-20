import { getQuestions, getQuestionDetail } from '../../services/ant-design-pro/question';
import { QUESTION_DETAIL } from '../../../config/constant';

export function getQuestionAction(userId, type) {
  return (dispatch) => {
    getQuestions(userId, type).then((res) => {
      if (res.code) {
        res.data.map((item) => {
          item.detail = item.detail.replace(/\n/g, '');
          return item;
        });
        dispatch({
          type: type,
          payload: res.data,
        });
      }
    });
  };
}

export function getQuestionDetailAction(id) {
  return (dispatch) => {
    getQuestionDetail(id).then((res) => {
      if (res.code) {
        res.data.map((item) => {
          item.detail = item.detail.replace(/\n/g, '');
          return item;
        });
        dispatch({
          type: QUESTION_DETAIL,
          payload: res.data,
        });
      }
    });
  };
}
