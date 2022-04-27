import { request } from 'umi';
import moment from 'moment';

export async function getQuestion() {
  return request('/api/review/getNoReviewQuestions', {
    method: 'get',
  });
}

export async function reviewQuestion(id, { status, mark }) {
  return request('/api/review/reviewQuestion', {
    method: 'post',
    data: {
      id,
      status,
      mark,
    },
  });
}
