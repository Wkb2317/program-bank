import React, { memo, useState, useEffect, useRef } from 'react';
import { Card, Select, List, Avatar, Button, message } from 'antd';
import { useSelector, shallowEqual } from 'react-redux';
import { readAllMessage } from '@/services/ant-design-pro/socket';
import dayjs from 'dayjs';
import Chart from '@/components/chart';
import { useDispatch } from 'react-redux';
import { changMessageAction } from '@/store/socket/actions';

const { Option } = Select;

const Message = memo(() => {
  const userId = localStorage.getItem('uuid');
  const [hasReadMessage, setHasReadMessage] = useState([]);
  const [noReadMessage, setNoReadMessage] = useState([]);
  const [currentType, setCurrentType] = useState('noRead');
  const [listData, setListData] = useState([]);
  const [chartVisable, setChartVisable] = useState(false);
  const toUserIdRef = useRef();
  const dispatch = useDispatch();

  const { allMessage } = useSelector((state) => ({
    allMessage: state.getIn(['Socket', 'allMessage']),
    shallowEqual,
  }));

  useEffect(() => {
    let hasRead = [];
    let noRead = [];
    allMessage.forEach((item) => {
      if (item.is_read === 'false' && item.from_id !== userId) {
        noRead.push(item);
      } else if (item.is_read === 'true' && item.to_id === userId) {
        hasRead.push(item);
      }
    });
    if (currentType === 'read') {
      setListData((e) => hasRead);
    } else {
      setListData((e) => noRead);
    }
  }, [allMessage, currentType]);

  const onReadAllMessage = async () => {
    const res = await readAllMessage(userId);
    if (res.code) {
      message.success(res.msg);
      let newAllMessage = _.cloneDeep(allMessage);
      newAllMessage.forEach((item) => {
        if (item.to_id == userId) {
          item.is_read = 'true';
        }
      });
      dispatch(changMessageAction(newAllMessage));
      return;
    }
    message.error(res.msg);
  };

  const changeType = (value) => {
    setCurrentType((e) => value);
  };

  const closeChartDiaLog = () => {
    setChartVisable((pre) => false);
  };

  const openChart = (item) => {
    toUserIdRef.current = item.from_id;
    setChartVisable((pre) => true);
  };

  return (
    <Card title="消息记录">
      <Select value={currentType} style={{ width: 120 }} onChange={changeType}>
        <Option value="noRead">未读</Option>
        <Option value="read">已读</Option>
      </Select>
      <Button onClick={onReadAllMessage} type="primary" style={{ marginLeft: 20 }}>
        全部已读
      </Button>
      <List
        style={{ marginTop: 20 }}
        itemLayout="horizontal"
        dataSource={listData}
        pagination={{
          onChange: (page) => {
            // console.log(page);
          },
          pageSize: 5,
        }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              onClick={(e) => openChart(item)}
              avatar={<Avatar src={item.from_user_avatar} />}
              title={
                <span>
                  {item.from_user_name}
                  <span style={{ marginLeft: 15 }}>
                    {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </span>
              }
              description="给你发了一条消息"
            />
          </List.Item>
        )}
      />
      <Chart
        visible={chartVisable}
        toUserId={toUserIdRef.current}
        onClose={closeChartDiaLog}
      ></Chart>
    </Card>
  );
});

export default Message;
