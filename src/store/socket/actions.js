import { message } from 'antd';
import * as types from '../../../config/constant';
import { getAllMessage } from '@/services/ant-design-pro/socket';

export function changeSocket(socket) {
  return {
    type: types.CHANGE_SOCKET,
    payload: socket,
  };
}

export function getAllMeaageAction(localUserId) {
  return (dispatch) => {
    getAllMessage(localUserId).then((res) => {
      if (res.code) {
        dispatch({
          type: types.ALL_MESSAGE,
          payload: res.data,
        });
      } else {
        message.error(res.msg);
      }
    });
  };
}

export function changMessageAction(newAllMessage) {
  return {
    type: types.ALL_MESSAGE,
    payload: newAllMessage,
  };
}
