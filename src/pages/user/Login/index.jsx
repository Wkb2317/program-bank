import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState, memo } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { getCaptcha } from '@/services/ant-design-pro/login';
import { updatePassword, register } from '@/services/ant-design-pro/user';

import styles from './index.less';
import { useDispatch } from 'react-redux';
import { getCurrentUser, setCurrentUser } from '../../../store/user/actions';
import { useEffect } from 'react';

const LoginMessage = memo(({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
));

const Login = memo(() => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const dispatch = useDispatch();

  useEffect(async () => {
    if (localStorage.getItem('token')) {
      await fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo(localStorage.getItem('token'));
    dispatch(setCurrentUser(userInfo));
    if (userInfo?.isLogin) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
      history.push('/question');
    } else {
      await setInitialState((s) => ({ ...s, currentUser: undefined }));
    }
  };

  const userLogin = async (values) => {
    let msg = await login({ ...values, type });
    if (msg?.code === 1) {
      localStorage.setItem('token', msg.token);
      localStorage.setItem('userEmail', values.email);
      localStorage.setItem('uuid', msg.id);
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      await fetchUserInfo();
      message.success(defaultLoginSuccessMessage);
      return;
    }
    message.error('账号或密码错误，请重新登录！');
    setUserLoginState(msg);
  };

  const forgetPassword = async (values) => {
    if (values.password !== values.surepassword) {
      message.error('两次输入的密码不同！');
      return;
    }
    const res = await updatePassword(values);
    // console.log(res);
    switch (res.code) {
      case 0:
        message.error(res.msg);
        break;
      case 1:
        message.success(res.msg);
        setType('account');
        break;
      case 2:
        message.error(res.msg);
        break;
      case 3:
        message.error(res.msg);
        break;
      default:
        break;
    }
  };

  const userRegister = async (values) => {
    // console.log(values);
    if (values.password !== values.surepassword) {
      message.error('两次输入的密码不一致！');
      return;
    }
    const res = await register(values);
    switch (res.code) {
      case 0:
        message.error(res.msg);
        break;
      case 1:
        message.success(res.msg);
        setType('account');
        break;
      case 2:
        message.error(res.msg);
        break;
      case 3:
        message.error(res.msg);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (values) => {
    if (type === 'account') {
      // 登录
      userLogin(values);
    } else if (type === 'mobile') {
      // 跟新密码
      forgetPassword(values);
    } else if (type === 'register') {
      userRegister(values);
    }
  };

  const handleGetCaptcha = async (email) => {
    // console.log(process.env);
    if (email === '') return;
    const result = await getCaptcha({
      email,
    });

    if (result.code === 1) {
      message.success('获取验证码成功！');
    }
  };

  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div> */}
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="http://110.40.236.242:8001/static/logo.png" />}
          title="程序设计题库"
          // subTitle={intl.formatMessage({
          //   id: 'pages.layouts.userLayout.title',
          // })}
          initialValues={{
            autoLogin: true,
          }}
          // actions={[
          //   <FormattedMessage
          //     key="loginWith"
          //     id="pages.login.loginWith"
          //     defaultMessage="其他登录方式"
          //   />,
          //   <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
          //   <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
          //   <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
          // ]}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.passwordLogin.tab',
                defaultMessage: '账户登录',
              })}
            />
            <Tabs.TabPane
              key="register"
              tab={intl.formatMessage({
                id: 'pages.login.register.tab',
                defaultMessage: '注册',
              })}
            />
            <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.forgetPassword.tab',
                defaultMessage: '忘记密码',
              })}
            />
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入邮箱!"
                      />
                    ),
                  },
                  {
                    pattern: /^\w{1,18}@[a-z0-9]+(\.[a-z]{2,4})+$/i,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="邮箱格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
              <div>
                <ProFormCheckbox noStyle name="autoLogin">
                  <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
                </ProFormCheckbox>
                <div
                  style={{
                    marginBottom: 24,
                    float: 'right',
                  }}
                >
                  <a
                    style={{
                      float: 'right',
                    }}
                  >
                    <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
                  </a>
                </div>
              </div>
            </>
          )}
          {type === 'register' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="email"
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入邮箱！"
                      />
                    ),
                  },
                  {
                    pattern: /^\w{1,18}@[a-z0-9]+(\.[a-z]{2,4})+$/i,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="邮箱格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />

              <ProFormText.Password
                name="surepassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.surepassword.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="email"
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入邮箱！"
                      />
                    ),
                  },
                  {
                    pattern: /^\w{1,18}@[a-z0-9]+(\.[a-z]{2,4})+$/i,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="邮箱格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }

                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="code"
                phoneName="email"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={handleGetCaptcha}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />

              <ProFormText.Password
                name="surepassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.surepassword.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      {/* <Footer /> */}
    </div>
  );
});

export default Login;
