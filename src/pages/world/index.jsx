import React, { useState, memo } from 'react';
import { Input, Button, Result, Avatar, Tag } from 'antd';
import { CrownOutlined, MessageOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import Settings from '../../../config/sildeSetting';
import './index.less';

export default memo((props) => {
  const [pathname, setPathname] = useState('/world/discuss');

  const defaultProps = {
    routes: [
      {
        path: '/world/rank',
        name: '激励榜',
        icon: <FundProjectionScreenOutlined />,
        component: './world/rank',
      },
      {
        path: '/world/discuss',
        name: '讨论角',
        icon: <MessageOutlined />,
        component: './world/discuss',
      },
    ],
  };

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
