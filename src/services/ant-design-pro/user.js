import { request } from 'umi';

export function updateUserInfo(data) {
  return request('/api/updateUserInfo', {
    method: 'post',
    data,
  });
}
