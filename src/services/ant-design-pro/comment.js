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

export async function likeComment(userId, commentId) {
  return request('/api/likeComment', {
    method: 'post',
    data: {
      userId,
      commentId,
    },
  });
}

export async function deleteComment(commentId) {
  return request('/api/deleteComment', {
    method: 'post',
    data: {
      commentId,
    },
  });
}
