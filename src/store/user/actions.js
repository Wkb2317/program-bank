import { currentUser } from '@/services/ant-design-pro/api';
import { updateUserInfo } from '@/services/ant-design-pro/user';
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

export function updateUserInfoAction(data) {
  return (dispatch) => {
    updateUserInfo(data).then((res) => {
      currentUser(localStorage.getItem('token')).then((res) => {
        // console.log(res);
        dispatch({
          type: 'currentUser',
          payload: res,
        });
      });
    });
  };
}
