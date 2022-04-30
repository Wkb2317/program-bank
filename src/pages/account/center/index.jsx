import React, { useState, memo, useEffect } from 'react';
import { Button, Result, Avatar, Tag, Input } from 'antd';
import { CrownOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import './index.less';

const defaultProps = {
  routes: [
    {
      path: '/account/profile',
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
      path: '/account/rank',
      name: '积分排行',
      icon: <SmileOutlined />,
      component: './account/rank',
    },
    {
      name: '题目收藏',
      path: '/account/collect',
      component: './account/collect',
      icon: <SmileOutlined />,
    },
  ],
};

export default memo((props) => {
  console.log();
  const [pathname, setPathname] = useState('/account/profile');
  useEffect(() => {
    const path = location.pathname;
    setPathname((e) => path);
  }, []);
  return (
    <>
      <ProLayout
        route={defaultProps}
        // route={props.route}
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
