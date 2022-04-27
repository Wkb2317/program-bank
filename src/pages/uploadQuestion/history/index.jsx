import { memo, useEffect, useState, useRef } from 'react';
import { Card, Table, Input, InputNumber, Button, message, Select } from 'antd';
import { getUploadQuestion } from '@/services/ant-design-pro/uploadQuestion';
import { columns } from './columns';
import dayjs from 'dayjs';

const UplodaHistory = memo(() => {
  const userId = localStorage.getItem('uuid');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  // request
  const getHistory = async () => {
    setLoading(true);
    const res = await getUploadQuestion(userId);
    console.log(res);
    if (res.code) {
      let newData = [];
      if (Object.keys(res.data).length) {
        newData = res.data.map((item, index) => {
          item.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss');
          item.key = index;
          return item;
        });
      }
      setData((_) => newData);
      setLoading((_) => false);
      return;
    }
    message.error(res.msg);

    setLoading((_) => false);
  };

  return (
    <Card title="提交记录">
      <Table pagination={{ pageSize: 5 }} loading={loading} columns={columns} dataSource={data} />
    </Card>
  );
});

export default UplodaHistory;
