import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import { useSelector, shallowEqual } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async (userEmail) => {
  await outLogin(userEmail);
  await localStorage.setItem('token', '');
  await localStorage.setItem('userEmail', '');
  history.replace('/user/login');
};

const AvatarDropdown = ({ menu }) => {
  const userId = localStorage.getItem('uuid');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [count, setCount] = useState(0);

  const { allMessage } = useSelector((state) => ({
    allMessage: state.getIn(['Socket', 'allMessage']),
    shallowEqual,
  }));

  useEffect(() => {
    let notReadCount = 0;
    allMessage.forEach((item) => {
      if (item.is_read === 'false' && userId !== item.from_id) {
        notReadCount++;
      }
    });
    setCount(notReadCount);
  }, [allMessage]);

  const onMenuClick = useCallback(
    async (event) => {
      const { key } = event;
      if (key === 'logout') {
        loginOut(localStorage.getItem('userEmail'));
        await setInitialState((s) => ({ ...s, currentUser: undefined }));
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser?.avatar) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="profile">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}

      <Menu.Item key="profile">
        <UserOutlined />
        个人中心
      </Menu.Item>

      <Menu.Item key="message">
        <UserOutlined />
        消息通知
      </Menu.Item>

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Badge count={count} size="small">
          <Avatar
            shape="square"
            // className={styles.avatar}
            src={currentUser?.avatar ? currentUser.avatar : ''}
            alt="avatar"
          />
        </Badge>
        <span className={[styles.name, 'anticon'].join(' ')}>{currentUser?.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
