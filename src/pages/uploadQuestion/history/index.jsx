import { memo, useEffect, useState, useRef } from 'react';
import {
  Card,
  Table,
  Modal,
  Form,
  Input,
  Button,
  Select,
  Space,
  Popconfirm,
  Tag,
  message,
} from 'antd';
import { getUploadQuestion, updateQuestion } from '@/services/ant-design-pro/uploadQuestion';
import dayjs from 'dayjs';
import { tagColor } from '../../../../config/constant';

const { Option } = Select;

const UplodaHistory = memo(() => {
  const userId = localStorage.getItem('uuid');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [questionId, setQuestionId] = useState('');
  const formRef = useRef();

  useEffect(() => {
    getHistory();
  }, []);

  const showModal = (id) => {
    setQuestionId(id);
    const questionItem = data.find((item) => item.id === id);
    setIsModalVisible(true);
    setTimeout(() => {
      formRef.current.setFieldsValue(questionItem);
    });
  };

  const handleOk = () => {
    onUpdateQuestion();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const layout = {
    labelCol: { span: 4 },
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
      key: 'detail',
      width: '800px',
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
      render: (text, record) =>
        record.status === 2 ? <a onClick={(e) => showModal(record.id)}>修改</a> : '',
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

  const onUpdateQuestion = async () => {
    console.log(questionId);
    const formData = formRef.current.getFieldValue();
    const res = await updateQuestion(questionId, formData);
    if (res.code) {
      message.success(res.msg);
      let newData = data.map((item) => {
        if (item.id === questionId) {
          item.title = formData.title;
          item.detail = formData.detail;
          item.type = formData.type;
          item.status = 0;
          item.mark = '';
        }
        return item;
      });
      setData((e) => newData);
      return;
    }
    message.error(res.msg);
  };

  return (
    <Card title="提交记录">
      <Table pagination={{ pageSize: 5 }} loading={loading} columns={columns} dataSource={data} />
      <Modal
        title="修改"
        visible={isModalVisible}
        onOk={handleOk}
        okText="修改"
        onCancel={handleCancel}
      >
        <Form ref={formRef} {...layout} name="nest-messages" validateMessages={validateMessages}>
          <Form.Item name={['title']} label="题目" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['detail']} label="详情" rules={[{ required: true }]}>
            <Input.TextArea showCount maxLength={400} style={{ height: 120 }} />
          </Form.Item>
          <Form.Item name={['type']} label="类型" rules={[{ required: true }]}>
            <Select>
              <Option value="0">简单</Option>
              <Option value="1">中等</Option>
              <Option value="2">困难</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
});

export default UplodaHistory;
