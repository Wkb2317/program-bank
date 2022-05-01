import React, { memo, useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import style from './index.less';
import { getAllMeaageAction, changMessageAction } from '@/store/socket/actions';
import { readMessage } from '@/services/ant-design-pro/socket';

const { TextArea } = Input;
const Chart = memo((props) => {
  const { visible, onClose, toUserId } = props;
  const { initialState, loading, refresh, setInitialState } = useModel('@@initialState');
  const { Socket } = initialState;
  const localUserId = localStorage.getItem('uuid');
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState([]);
  const chartRef = useRef();
  const messageRef = useRef();
  const allMessageRef = useRef();
  const dispatch = useDispatch();

  let { allMessage } = useSelector((state) => ({
    allMessage: state.getIn(['Socket', 'allMessage']),
    shallowEqual,
  }));

  allMessageRef.current = allMessage;

  useEffect(() => {
    if (visible) {
      setMessage((e) =>
        allMessage.filter((item) => {
          return (
            (item.from_id === localUserId && item.to_id === toUserId) ||
            (item.from_id === toUserId && item.to_id === localUserId)
          );
        }),
      );
    } else {
      setMessage(null);
    }
  }, [visible, allMessage, toUserId]);

  useEffect(async () => {
    if (visible) {
      let newAllMessage = _.cloneDeep(allMessage);
      newAllMessage.forEach((item) => {
        if (item.from_id == toUserId) {
          item.is_read = 'true';
        }
      });
      dispatch(changMessageAction(newAllMessage));
      const res = await readMessage(localUserId, toUserId);
    }
  }, [visible]);

  useEffect(() => {
    chartRef.current.style.display = visible ? 'block' : 'none';
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [visible, toUserId]);

  // 接收消息;
  useEffect(() => {
    Socket &&
      Socket.on('getMessage', (msg) => {
        setTimeout(() => {
          scrollToBottom();
        }, 200);
      });
    return () => {
      Socket && Socket.off('getMessage');
    };
  }, [Socket]);

  // 滚动到底部
  const scrollToBottom = () => {
    let scroll = messageRef.current.scrollHeight - messageRef.current.clientHeight;
    messageRef.current.scrollTop = scroll;
  };

  const submit = () => {
    const { name, avatar } = initialState.currentUser;
    const params = {
      to_id: toUserId,
      from_id: localStorage.getItem('uuid'),
      message: inputValue,
      from_user_avatar: avatar,
      from_user_name: name,
      to_user_avatar: '',
      to_user_name: '',
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      is_read: 'fasle',
    };
    Socket && Socket.emit('sendMessage', JSON.stringify(params));
    let newAllMessage = [...allMessageRef.current, params];
    dispatch(changMessageAction(newAllMessage));

    setTimeout(() => {
      scrollToBottom();
    }, 200);
    // dispatch(getAllMeaageAction(localUserId, toUserId));
    setInputValue((e) => null);
  };

  const closeChart = () => {
    onClose();
    setInputValue((pre) => null);
  };

  const mineStyle = {
    float: 'right',
  };

  const mineBg = {
    backgroundColor: '#12b7f5',
  };

  return (
    <div ref={chartRef} className={style.chart}>
      <CloseCircleOutlined onClick={closeChart} className={style.close} />
      <div ref={messageRef} className={style.content}>
        {message &&
          message.map((item, index) => {
            return (
              <div
                key={index}
                style={item.from_id === localUserId ? mineStyle : {}}
                className={style.listItem}
              >
                <div
                  style={item.from_id === localUserId ? mineStyle : {}}
                  className={style.userInfo}
                >
                  <span className={style.username}>{item.from_user_name}</span>
                  <img className={style.avatar} src={item.from_user_avatar} alt="" />
                </div>
                <div
                  style={item.from_id === localUserId ? { ...mineStyle, ...mineBg } : {}}
                  className={style.message}
                >
                  <div>{item.message}</div>
                </div>
              </div>
            );
          })}
      </div>
      <div className={style.inputArea}>
        <TextArea
          showCount
          rows={5}
          bordered={false}
          placeholder="最长100字符"
          maxLength={100}
          value={inputValue}
          className={style.textArea}
          onPressEnter={submit}
          onChange={(e) => setInputValue(e.currentTarget.value)}
        />
        <button onClick={submit} className={style.submit}>
          发送
        </button>
      </div>
    </div>
  );
});

export default Chart;
