import { request } from 'umi';

export async function getQuestions(userId, id) {
  return request('/api/getQuestions', {
    method: 'GET',
    params: {
      userId,
      type: id,
    },
  });
}

export async function getQuestionDetail(userId, questionId) {
  return request('/api/getQuestionDetail', {
    method: 'GET',
    params: {
      userId,
      questionId,
    },
  });
}

export async function collectQuestion(userId, questionId) {
  return request('/api/collectQuestion', {
    method: 'GET',
    params: {
      userId,
      questionId,
    },
  });
}
