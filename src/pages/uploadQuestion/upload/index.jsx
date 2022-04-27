import React, { memo } from 'react';
import { Card, Form, Input, InputNumber, Button, message, Select } from 'antd';
import { uploadQuestion, deleteUploadQuestion } from '@/services/ant-design-pro/uploadQuestion';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const { Option } = Select;

const upload = memo(() => {
  const userId = localStorage.getItem('uuid');
  const formRef = useRef();

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
  };

  const validateMessages = {
    required: '${label} 请填写完整!',
  };

  const onSubmit = async (value) => {
    console.log(formRef);
    const res = await uploadQuestion(value.question, userId);
    console.log(res);
    if (res.code) {
      message.success(res.msg);
      formRef.current.resetFields();
      return;
    }
    message.error(res.msg);
  };

  return (
    <Card title="请上传题目">
      <Form
        ref={formRef}
        {...layout}
        name="nest-messages"
        onFinish={onSubmit}
        validateMessages={validateMessages}
      >
        <Form.Item name={['question', 'title']} label="题目" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name={['question', 'type']} label="类型" rules={[{ required: true }]}>
          <Select style={{ width: 120 }}>
            <Option value="0">简单</Option>
            <Option value="1">中等</Option>
            <Option value="2">困难</Option>
          </Select>
        </Form.Item>

        <Form.Item name={['question', 'detail']} label="描述" rules={[{ required: true }]}>
          <Input.TextArea showCount maxLength={400} style={{ height: 120 }} />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
          <Button type="primary" htmlType="submit">
            上传
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});

export default upload;
