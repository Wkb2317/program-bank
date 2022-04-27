import React, { useState, memo, useEffect } from 'react';
import { Input, Button, Result, Avatar, Tag } from 'antd';
import { FormOutlined, CrownOutlined, UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import './index.less';

const defaultProps = {
  routes: [
    {
      path: '/admin/review',
      name: '题目审核',
      icon: <FormOutlined />,
      component: './admin/reviewQuestion',
    },
    // {
    //   path: '/upload/history',
    //   name: '上传记录',
    //   icon: <FileTextOutlined />,
    //   component: './uploadQuestion/history',
    // },
  ],
};

export default memo((props) => {
  const [pathname, setPathname] = useState('/admin/review');

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
