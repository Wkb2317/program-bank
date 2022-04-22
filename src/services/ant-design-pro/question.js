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

export async function saveCode(userId, questionId, value, isCollect) {
  return request('/api/saveCode', {
    method: 'post',
    data: {
      userId,
      questionId,
      value,
      isCollect,
    },
  });
}

export async function submitCode(userId, questionId, value) {
  return request('/api/submitCode', {
    method: 'post',
    data: {
      userId,
      questionId,
      value,
    },
  });
}

export async function getSubmitHistory(userId, questionId) {
  return request('/api/getSubmitHistory', {
    method: 'get',
    params: {
      userId,
      questionId,
    },
  });
}

export async function saveMark(markId, mark) {
  return request('/api/setMark', {
    method: 'post',
    data: {
      markId,
      mark,
    },
  });
}

export async function deleteSubmit(userId, markId) {
  return request('/api/deleteSubmit', {
    method: 'post',
    data: {
      markId,
      userId,
    },
  });
}
