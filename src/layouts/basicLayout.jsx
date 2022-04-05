import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';
import {
  AppstoreOutlined,
  BarChartOutlined,
  GlobalOutlined,
  HomeOutlined,
  SafetyOutlined,
  SketchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Menu, notification, Result } from 'antd';
import HeaderSearch from '@/components/HeaderSearch';
import SubMenu from 'antd/lib/menu/SubMenu';

import defaultSettings from '../../config/defaultSettings';
import './BasicLayout.less';

/*
 * use Authorized check all menu item
 */

const menuDataRender = (menuList) => {
  return menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });
};

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    route,
    location = {
      pathname: '/',
    },
  } = props;

  useEffect(() => {}, []);

  useEffect(() => {}, []);

  // route.routes?.forEach((r) => {
  //   if (r.path === location.pathname) {
  //     authority = r.authority;
  //   }
  // });

  return (
    <ProLayout
      {...props}
      {...defaultSettings}
      layout="side"
      navTheme="realDark"
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      // menuDataRender={() => menuDataRender(menu)}
      headerContentRender={() => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname ?? '/']}
            onClick={({ key }) => history.push(key)}
            style={{ height: '100%', border: 0 }}
          >
            {/* {currentUser._id && (
              <Menu.Item key="/account/info" icon={<HomeOutlined />}>
                个人
              </Menu.Item>
            )} */}
            <Menu.Item key="/recommend" icon={<SketchOutlined />}>
              发现
            </Menu.Item>
            <Menu.Item key="/resources" icon={<AppstoreOutlined />}>
              资源
            </Menu.Item>
            <SubMenu key="/world" icon={<GlobalOutlined />} title="世界">
              <Menu.Item key="/friend" icon={<UserAddOutlined />}>
                找伙伴
              </Menu.Item>
              <Menu.Item key="/ranking" icon={<BarChartOutlined />}>
                激励榜
              </Menu.Item>
            </SubMenu>
            {/* {currentUser._id && currentAuthority.includes('admin') && (
              <SubMenu key="/review" icon={<SafetyOutlined />} title="运营">
                <Menu.Item key="/review/resource">审核资源</Menu.Item>
                <Menu.Item key="/review/comment">审核评论</Menu.Item>
                <Menu.Item key="/review/report">审核举报</Menu.Item>
                <Menu.Item key="/review/notice">公告管理</Menu.Item>
              </SubMenu>
            )} */}
          </Menu>
          <div className="header-search-bar">
            <HeaderSearch placeholder="全站搜索编程资源" />
          </div>
        </div>
      )}
      // rightContentRender={() => <RightContent />}
    >
      {children}
    </ProLayout>
  );
};

export default BasicLayout;
