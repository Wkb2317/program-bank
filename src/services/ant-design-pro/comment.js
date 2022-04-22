import { request } from 'umi';

export async function submitComment(userId, questionId, content) {
  return request('/api/submitComment', {
    method: 'POST',
    data: {
      userId,
      questionId,
      content,
    },
  });
}

export async function getComment(userId, questionId) {
  return request('/api/getComment', {
    method: 'get',
    params: {
      userId,
      questionId,
    },
  });
}
