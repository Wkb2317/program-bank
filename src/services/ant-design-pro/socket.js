import { request } from 'umi';

export function getAllMessage(localUserId) {
  // console.log(localUserId, toUserId);
  return request('/api/getAllMessage', {
    method: 'post',
    data: {
      localUserId,
    },
  });
}

export function readMessage(localUserId, to_id) {
  return request('/api/readMessage', {
    method: 'post',
    data: {
      to_id: localUserId,
      from_id: to_id,
    },
  });
}

export function readAllMessage(to_id) {
  return request('/api/readAllMessage', {
    method: 'post',
    data: {
      to_id: to_id,
    },
  });
}
