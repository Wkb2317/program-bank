import { FundProjectionScreenOutlined } from '@ant-design/icons';
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

// 积分记录
export function getInegrationHistory(uuid) {
  return request('/api/getInegrationHistory', {
    method: 'get',
    params: { uuid },
  });
}

// 积分总榜
export function getTotalIntegrationRank() {
  return request('/api/getTotalIntegrationRank', {
    method: 'get',
  });
}

// 个人积分排行
export function getMyRank(uuid) {
  return request('/api/getMyRank', {
    method: 'get',
    params: { uuid },
  });
}

// 周榜
export function getWeekRank(startTime, endTime) {
  return request('/api/getWeekRank', {
    method: 'get',
    params: {
      startTime,
      endTime,
    },
  });
}

// 月榜
export function getMonthRank(month) {
  return request('/api/getMonthRank', {
    method: 'get',
    params: { month },
  });
}
