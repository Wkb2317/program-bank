import { currentUser } from '@/services/ant-design-pro/api';
import { updateUserInfo } from '@/services/ant-design-pro/user';
import { message } from 'antd';
import { history } from 'umi';

export function getCurrentUser(token) {
  return (dispatch) => {
    currentUser(token).then((res) => {
      if (res.isLogin) {
        dispatch({
          type: 'currentUser',
          payload: res,
        });
        if (location.path === '/user/login') {
          history.push('/welcome');
        }
      } else {
        message.error('请重新登录！');
        console.log(location.pathname);
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
      console.log(res);
      if (res.code === 1) {
        message.success('修改成功');
        currentUser(localStorage.getItem('token')).then((res) => {
          dispatch({
            type: 'currentUser',
            payload: res,
          });
        });
      } else {
        message.error('提交失败');
      }
    });
  };
}
