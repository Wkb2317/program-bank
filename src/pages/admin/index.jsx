import React, { useState, memo, useEffect } from 'react';
import { Input, Button, Result, Avatar, Tag } from 'antd';
import {
  FormOutlined,
  UsergroupAddOutlined,
  UploadOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import './index.less';

export default memo((props) => {
  const [pathname, setPathname] = useState('/admin/review');

  const defaultProps = {
    routes: [
      {
        path: '/admin/userManage',
        name: '用户管理',
        icon: <UsergroupAddOutlined />,
        component: './admin/userManage',
      },
      {
        path: '/admin/review',
        name: '题目审核',
        icon: <FormOutlined />,
        component: './admin/reviewQuestion',
      },
      {
        path: '/admin/comment',
        name: '评论审核',
        icon: <FormOutlined />,
        component: './admin/reviewComment',
      },
    ],
  };

  useEffect(() => {
    const path = location.pathname;
    setPathname((e) => path);
  }, []);
  return (
    <>
      <ProLayout
        route={defaultProps}
        location={{
          pathname,
        }}
        navTheme="light"
        fixSiderbar
        headerRender={false}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              setPathname(item.path);
              history.push(item.path);
            }}
          >
            {dom}
          </a>
        )}
      >
        <PageContainer onBack={() => null}>{props.children}</PageContainer>
      </ProLayout>
    </>
  );
});
