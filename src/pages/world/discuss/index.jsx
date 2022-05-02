import React, { memo, useState, useRef, useEffect } from 'react';
import { Input, Button, Card, List, Avatar, message } from 'antd';
import style from './index.less';
import { submitDiscuss, getDiscuss } from '@/services/ant-design-pro/comment';
import _ from 'lodash';
import moment from 'moment';
const { TextArea } = Input;
import Chart from '@/components/chart';

const discuss = memo(() => {
  const userId = localStorage.getItem('uuid');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [inputData, setInputData] = useState('');
  const [discussData, setDiscussData] = useState([]);
  const [chartVisable, setChartVisbale] = useState(false);
  const toUserIdRef = useRef();

  useEffect(() => {
    getDiscussData();
  }, []);

  useEffect(() => {
    discussData.length && scrollToBottom();
  }, [discussData]);

  // 滚动到底部
  const scrollToBottom = () => {
    let list = document.querySelector('.antlist');
    let scroll = list.scrollHeight - list.clientHeight;
    list.scrollTop = scroll;
  };

  const getDiscussData = async () => {
    const res = await getDiscuss();
    if (!res.code) {
      message.error(res.msg);
      return;
    }
    setDiscussData(res.data);
  };

  const onChange = (e) => {
    setInputData(e.target.value);
  };

  const onSubmitDiscuss = async () => {
    if (!inputData.trim()) {
      message.error('请输入信息');
      return;
    }
    const res = await submitDiscuss(userId, inputData);
    if (res.code) {
      message.success(res.msg);
      let newDiscussData = _.cloneDeep(discussData);
      newDiscussData.push({
        name: userInfo.name,
        avatar: userInfo.avatar,
        data: inputData,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
      setDiscussData((e) => newDiscussData);
      setInputData((e) => '');
      return;
    }
    message.error(res.msg);
  };

  const closeChartDiaLog = () => {
    setChartVisbale((pre) => false);
  };

  const openChart = (listItem) => {
    toUserIdRef.current = listItem.user_id;
    setChartVisbale((e) => true);
  };

  return (
    <Card title="讨论角" className={style.wrapper}>
      <List
        className={['antlist', style.antlist].join(' ')}
        split={false}
        itemLayout="horizontal"
        dataSource={discussData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar onClick={(e) => openChart(item)} src={item.avatar} />}
              title={
                <a onClick={(e) => openChart(item)}>
                  {item.name + '   ' + moment(item.time).format('YYYY-MM-DD HH:mm:ss')}
                </a>
              }
              description={item.data}
            />
          </List.Item>
        )}
      />
      <TextArea
        showCount
        value={inputData}
        maxLength={200}
        style={{ height: 120 }}
        onChange={onChange}
      />
      <div className={style.submit}>
        <Button onClick={onSubmitDiscuss} type="primary">
          提交
        </Button>
      </div>
      <Chart
        visible={chartVisable}
        toUserId={toUserIdRef.current}
        onClose={closeChartDiaLog}
      ></Chart>
    </Card>
  );
});

export default discuss;
