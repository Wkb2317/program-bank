import { currentUser } from '@/services/ant-design-pro/api';
import { updateUserInfo } from '@/services/ant-design-pro/user';
import { message } from 'antd';
import { history } from 'umi';

export function setCurrentUser(userinfo) {
  return (dispatch) => {
    dispatch({
      type: 'currentUser',
      payload: userinfo,
    });
  };
}

export function getCurrentUser(token) {
  return (dispatch) => {
    currentUser(token).then((res) => {
      if (res.isLogin) {
        if (location.pathname === '/user/login') {
          history.push('/question');
        }
        dispatch({
          type: 'currentUser',
          payload: res,
        });
      } else {
        message.error('请重新登录！');
        if (location.pathname !== '/user/login') {
          history.push('/user/login');
        }
      }
    });
  };
}

export function updateUserInfoAction(data) {
  return (dispatch) => {
    updateUserInfo(data).then((res) => {
      if (res.code === 1) {
        dispatch({
          type: 'currentUser',
          payload: res.data,
        });
      } else {
        message.error('提交失败');
      }
    });
  };
}
