import React, { memo, useEffect, useState, useRef } from 'react';
import { Card, Table, Space, Modal, Form, Input, Tag, message, Select } from 'antd';
import { getQuestion, reviewQuestion } from '@/services/ant-design-pro/review';
import dayjs from 'dayjs';

const { Option } = Select;

const ReviewQuestion = memo(() => {
  const tagColor = ['#5BD8A6', '#FF9900', '#FF0033'];
  const userId = localStorage.getItem('uuid');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [questionId, setQuestionId] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    getAllReviewQuestions();
  }, []);

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
  };

  const validateMessages = {
    required: '${label} 请填写完整!',
  };

  const columns = [
    {
      title: '题目',
      align: 'center',
      width: '200px',
      dataIndex: 'title',
      key: 'name',
    },
    {
      title: '详情',
      align: 'center',
      dataIndex: 'detail',
      width: '800px',
      key: 'detail',
    },
    {
      title: '类型',
      align: 'center',
      key: 'detail',
      render: (text, record) => {
        switch (record.type) {
          case '0':
            return <Tag color={tagColor[0]}>简单</Tag>;
          case '1':
            return <Tag color={tagColor[1]}>中等</Tag>;
          case '2':
            return <Tag color={tagColor[2]}>困难</Tag>;
        }
      },
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
          <a onClick={(e) => showModal(record.id)}>审批</a>
        </Space>
      ),
    },
  ];

  const showModal = (id) => {
    setQuestionId(id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    formRef.current.resetFields();
    setIsModalVisible(false);
  };

  // request
  const getAllReviewQuestions = async () => {
    setLoading(true);
    const res = await getQuestion();
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

  const onSubmit = async () => {
    const value = formRef.current.getFieldValue();
    const res = await reviewQuestion(questionId, value);
    if (res.code) {
      message.success(res.msg);
      getAllReviewQuestions();
      setIsModalVisible(false);
      return;
    }
    message.error(res.msg);
    setIsModalVisible(false);
  };

  return (
    <Card title="题目审核">
      <Table pagination={{ pageSize: 5 }} loading={loading} columns={columns} dataSource={data} />
      <Modal title="审核" visible={isModalVisible} onOk={onSubmit} onCancel={handleCancel}>
        <Form ref={formRef} {...layout} name="nest-messages" validateMessages={validateMessages}>
          <Form.Item name={['status']} label="类型" rules={[{ required: true }]}>
            <Select style={{ width: 120 }}>
              <Option value="1">通过</Option>
              <Option value="2">不通过</Option>
            </Select>
          </Form.Item>

          <Form.Item name={['mark']} label="备注">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
});

export default ReviewQuestion;
