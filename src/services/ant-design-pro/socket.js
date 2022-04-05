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
