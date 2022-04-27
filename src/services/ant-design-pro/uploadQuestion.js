import { request } from 'umi';
import moment from 'moment';

export async function uploadQuestion({ title, detail, type }, userId) {
  return request('/api/uploadQuestion', {
    method: 'post',
    data: {
      title,
      detail,
      userId,
      type,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  });
}

export async function getUploadQuestion(userId) {
  return request('/api/getUploadQuestion', {
    method: 'get',
    params: {
      userId,
    },
  });
}
