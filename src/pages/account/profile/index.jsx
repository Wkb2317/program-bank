import React, { memo } from 'react';
import { useEffect } from 'react';
import { Divider, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '@/store/user/actions';
import './index.less';

const Profile = memo(function profile() {
  const dispatch = useDispatch();

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
  const showDialog = () => {
    console.log('cilck');
  };
  return (
    <div>
      {currentUser?.isLogin && (
        <div className="userinfo">
          <div className="top">
            <img className="avatar" src={currentUser?.avatar} alt="" />
            <span className="username">{currentUser?.name}</span>
          </div>

          <div className="main">
            <div className="title">
              <span>信息</span>
              <Button onClick={showDialog} type="primary" icon={<EditOutlined />}>
                编辑
              </Button>
            </div>
            <Divider></Divider>
            <div className="info"></div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Profile;
