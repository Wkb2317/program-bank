import { request } from 'umi';

export async function getQuestions(id) {
  return request('/api/getQuestions', {
    method: 'GET',
    params: {
      type: id,
    },
  });
}

export async function getQuestionDetail(id) {
  return request('/api/getQuestionDetail', {
    method: 'GET',
    params: {
      id,
    },
  });
}
