import React, { memo, useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import { Divider, Button, Modal, Form, Input, Upload, message, Row, Col } from 'antd';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, updateUserInfoAction } from '@/store/user/actions';
import './index.less';

const Profile = memo(function profile() {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const style = {
    padding: '16px 8px',
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  useEffect(() => {
    dispatch(getCurrentUser(localStorage.getItem('token')));
  }, [dispatch]);

  const { currentUser } = useSelector(
    (state) => ({
      currentUser: state.getIn(['CurrentUser', 'currentUser']),
    }),
    shallowEqual,
  );

  console.log(currentUser);

  /**
   *  dialog
   * */
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    formRef.current.resetFields();
    setIsModalVisible(false);
  };

  // form 表单提交
  const onFinish = (values) => {
    values.user.avatar = imageUrl;
    values.user.email = localStorage.getItem('userEmail');
    dispatch(updateUserInfoAction(values.user));
    setIsModalVisible(false);
  };

  /**
   *  image
   * */
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片！');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片大小需小于1MB!');
    }
    return isJpgOrPng && isLt1M;
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      console.log(info.file.response.url);
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        console.log(imageUrl);
        setImageUrl(info.file.response.url);
      });
    }
  };

  const normFile = (e) => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  /**
   *  upload component
   * */
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div>
      {currentUser?.isLogin && (
        <div className="userinfo">
          <div className="top">
            <img className="avatar" src={currentUser?.avatar} alt="" />
            <span className="username">{currentUser?.name ? currentUser.name : '程序猿'}</span>
          </div>

          <div className="main">
            <div className="title">
              <span>信息</span>
              <Button onClick={showModal} type="primary" icon={<EditOutlined />}>
                编辑
              </Button>
              <Modal
                title="修改信息"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={false}
              >
                <Form
                  {...layout}
                  name="nest-messages"
                  onFinish={onFinish}
                  ref={formRef}
                  validateMessages={validateMessages}
                  labelAlign="left"
                >
                  <Form.Item name={['user', 'name']} label="姓名" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name={['user', 'class']} label="班级" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name={['user', 'avatar']}
                    label="头像"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="http://110.40.236.242:8001/api/upload"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Form.Item>
                  <Form.Item name={['user', 'interesting']} label="兴趣">
                    <Input />
                  </Form.Item>
                  <Form.Item name={['user', 'introduction']} label="个人简介">
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 16 }}>
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </div>

            <Divider></Divider>

            <div className="info">
              <div className="class">
                <Row gutter={12}>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>班级</div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>{currentUser?.class ? currentUser.class : '暂无'}</div>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>邮箱</div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>{currentUser.email}</div>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>积分</div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>{currentUser.integral}</div>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>个人简介</div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>
                      {currentUser.introduction ? currentUser.introduction : '暂无'}
                    </div>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>注册时间</div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div style={style}>
                      {moment(currentUser.registerTime).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Profile;
