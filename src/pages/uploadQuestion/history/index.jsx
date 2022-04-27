import { memo, useEffect, useState, useRef } from 'react';
import { Card, Table, Input, Button, Select, Space, Popconfirm, Tag, message } from 'antd';
import { getUploadQuestion, deleteUploadQuestion } from '@/services/ant-design-pro/uploadQuestion';
import dayjs from 'dayjs';

const UplodaHistory = memo(() => {
  const userId = localStorage.getItem('uuid');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  const columns = [
    {
      title: '题目',
      align: 'center',
      dataIndex: 'title',
      key: 'name',
    },
    {
      title: '详情',
      align: 'center',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'time',
      align: 'center',
      key: 'time',
    },
    {
      title: '状态',
      align: 'center',
      key: 'status',
      render: (text, record) => {
        switch (record.status) {
          case 0:
            return <Tag color="gray">未审批</Tag>;
          case 1:
            return <Tag color="success">通过</Tag>;
          case 2:
            return <Tag color="error">未通过</Tag>;
        }
      },
    },
    {
      title: '备注',
      align: 'center',
      key: 'mark',
      dataIndex: 'mark',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            onConfirm={(e) => onDeleteHistory(record.id)}
            title="确认删除吗？"
            okText="删除"
            cancelText="取消"
          >
            <a> 删除记录</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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

  const onDeleteHistory = async (id) => {
    const res = await deleteUploadQuestion(id);
    if (res.code) {
      message.success(res.msg);
      let newData = data.filter((item) => item.id !== id);
      setData((e) => newData);
      return;
    }
    message.error(res.msg);
  };

  return (
    <Card title="提交记录">
      <Table pagination={{ pageSize: 5 }} loading={loading} columns={columns} dataSource={data} />
    </Card>
  );
});

export default UplodaHistory;
