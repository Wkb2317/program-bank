import React, { memo, useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import style from './index.less';
// import { getAllMeaageAction } from '@/store/socket/actions';

const { TextArea } = Input;
const Chart = memo((props) => {
  const { visible, onClose, toUserId } = props;
  const { initialState, setInitialState } = useModel('@@initialState');
  const { Socket } = initialState;
  const localUserId = localStorage.getItem('uuid');
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState([]);
  const chartRef = useRef();
  const messageRef = useRef();
  const dispatch = useDispatch();

  // console.log(toUserId);

  useEffect(() => {
    // console.log(initialState.allMessage);
    // console.log(toUserId);
    setMessage((e) =>
      initialState.allMessage.filter((item) => {
        return (
          (item.from_id === localUserId && item.to_id === toUserId) ||
          (item.from_id === toUserId && item.to_id === localUserId)
        );
      }),
    );
    if (visible) {
    } else {
      setMessage(null);
    }

    console.log(toUserId);
  }, [visible, initialState, toUserId]);

  useEffect(() => {
    // dispatch(getAllMeaageAction(localUserId, toUserId));
    setTimeout(() => {
      scrollToBottom();
    }, 200);
    chartRef.current.style.display = visible ? 'block' : 'none';
  }, [visible, dispatch, toUserId]);

  // 接收消息
  useEffect(() => {
    Socket &&
      Socket.on('getMessage', (msg) => {
        console.log(`接收到---${msg.from_user_name}---信息`);
        console.log(msg);
        setMessage((e) => [...e, msg]);
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      });
    return () => {
      Socket && Socket.off('getMessage');
    };
  }, [dispatch, Socket]);

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
    };
    console.log(params);
    setMessage((e) => [...e, params]);
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    Socket && Socket.emit('sendMessage', JSON.stringify(params));
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
