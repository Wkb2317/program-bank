import { request } from 'umi';
import moment from 'moment';

export async function getQuestion() {
  return request('/api/review/getNoReviewQuestions', {
    method: 'get',
  });
}

export async function reviewQuestion(id, { status, mark }, userId) {
  return request('/api/review/reviewQuestion', {
    method: 'post',
    data: {
      id,
      status,
      mark,
      userId,
    },
  });
}

export async function getAllUser(userId) {
  return request('/api/admin/getAllUser', {
    method: 'get',
    params: {
      userId,
    },
  });
}

export async function changeUserAccess(changeUserId, access) {
  return request('/api/review/changeUserAccess', {
    method: 'post',
    data: {
      changeUserId,
      access,
    },
  });
}

export async function getCommentAndReply() {
  return request('/api/admin/getAllCommentAndReply', {
    method: 'get',
  });
}

export async function deleteComment(id, type) {
  return request('/api/review/deleteBadComment', {
    method: 'post',
    data: {
      id,
      type,
    },
  });
}

export async function passComment(id, type) {
  return request('/api/review/passComment', {
    method: 'post',
    data: {
      id,
      type,
    },
  });
}
