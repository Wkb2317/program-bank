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

export async function submitReply(commentId, userId, content) {
  return request('/api/submitReply', {
    method: 'post',
    data: {
      commentId,
      userId,
      content,
    },
  });
}

export async function getReply(commentId) {
  return request('/api/getReply', {
    method: 'get',
    params: {
      commentId,
    },
  });
}

export async function deleteReply(id) {
  return request('/api/deleteReply', {
    method: 'post',
    data: {
      id,
    },
  });
}

export async function getDiscuss() {
  return request('/api/getDiscuss', {
    method: 'get',
  });
}

export async function submitDiscuss(userId, data) {
  return request('/api/submitDiscuss', {
    method: 'post',
    data: {
      userId,
      data,
    },
  });
}
