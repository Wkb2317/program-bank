import { currentUser } from '@/services/ant-design-pro/api';
import { message } from 'antd';

export function getCurrentUser(token) {
  return (dispatch) => {
    currentUser(token).then((res) => {
      // console.log(res);
      dispatch({
        type: 'currentUser',
        payload: res,
      });
    });
  };
}
