import { request } from 'umi';

export function updateUserInfo(data) {
  return request('/api/updateUserInfo', {
    method: 'post',
    data,
  });
}

export function register(data) {
  return request('/api/register', {
    method: 'post',
    data,
  });
}

export function updatePassword(data) {
  return request('/api/updatePassword', {
    method: 'post',
    data,
  });
}
