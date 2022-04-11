import { request } from 'umi';

export async function getQuestions(params) {
  return request('/api/getQuestions', {
    method: 'GET',
    params: {
      type: params.name,
    },
  });
}
