import { request } from 'umi';

// 更新用户信息
export function updateUserInfo(data) {
  return request('/api/updateUserInfo', {
    method: 'post',
    data,
  });
}

// 注册
export function register(data) {
  return request('/api/register', {
    method: 'post',
    data,
  });
}

// 更新密码
export function updatePassword(data) {
  return request('/api/updatePassword', {
    method: 'post',
    data,
  });
}

// 是否第一次登录
export function getLoginIntegration(uuid) {
  return request('/api/getLoginIntegration', {
    method: 'get',
    params: { uuid },
  });
}
