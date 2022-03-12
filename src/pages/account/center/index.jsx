import React, { useState } from 'react';
import { Button, Result, Avatar, Tag, Input } from 'antd';
import { CrownOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';

import './index.less';
const defaultProps = {
  routes: [
    {
      path: '/account',
      name: '个人资料 ',
      icon: <CrownOutlined />,
      component: './account/profile',
    },
    {
      path: '/account/score',
      name: '积分记录',
      icon: <UserOutlined />,
      component: './account/score',
    },
    {
      path: '/admin/sub-page3',
      name: '三级页面',
      icon: <SmileOutlined />,
      component: './Welcome',
    },
  ],
};

export default (props) => {
  const [pathname, setPathname] = useState('/account');

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
              // console.log(item.path);
              setPathname(item.path || '/account');
              history.push(item.path);
            }}
          >
            {dom}
          </a>
        )}
        // rightContentRender={() => (
        //   <div>
        //     <Avatar shape="square" size="small" icon={<UserOutlined />} />
        //   </div>
        // )}
      >
        <PageContainer
          onBack={() => null}
          // tags={<Tag color="blue">状态一</Tag>}
          // header={{
          //   style: {
          //     padding: '4px 16px',
          //     position: 'fixed',
          //     top: 0,
          //     width: '100%',
          //     left: 0,
          //     zIndex: 999,
          //     boxShadow: '0 2px 8px #f0f1f2',
          //   },
          // }}
          // style={{
          //   paddingTop: 48,
          // }}
          // extra={[
          //   <Input.Search
          //     key="search"
          //     style={{
          //       width: 240,
          //     }}
          //   />,
          //   <Button key="3">操作一</Button>,
          //   <Button key="2" type="primary">
          //     操作一
          //   </Button>,
          // ]}
        >
          {props.children}
          {/* <div>
            <Result
              status="404"
              style={{
                height: '100%',
                background: '#fff',
              }}
              title="Hello World"
              subTitle="Sorry, you are not authorized to access this page."
              extra={<Button type="primary">Back Home</Button>}
            />
          </div> */}
        </PageContainer>
      </ProLayout>
    </>
  );
};
