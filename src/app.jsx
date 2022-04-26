import { useEffect } from 'react';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import { Provider } from 'react-redux';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
import './app.less';
import { store } from './store/index';
import { setCurrentUser } from './store/user/actions';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { getAllMessage } from '@/services/ant-design-pro/socket';
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  const token = window.localStorage.getItem('token');
  const uuid = window.localStorage.getItem('uuid');

  let allMessage = [];
  let currentUser = {};
  let Socket = null;

  const fetchUserInfo = async (token) => {
    try {
      const msg = await queryCurrentUser(token);
      if (msg.isLogin) {
        localStorage.setItem('userInfo', JSON.stringify(msg));
        return msg;
      } else {
        history.push(loginPath);
      }
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  };

  if (token) {
    currentUser = await fetchUserInfo(token);
  }

  // 不是登录界面
  if (history.location.pathname !== loginPath) {
    const res = await getAllMessage(uuid);
    res.code === 1 ? (allMessage = res.data) : (allMessage = []);

    // prod : ws://110.40.236.242:8001/
    // dev: ws://127.0.0.1:8001/
    Socket = io('ws://127.0.0.1:8001/', {
      reconnectionDelayMax: 10000,
      query: {
        id: uuid,
      },
    });
    Socket.on('connect', () => {
      // 连接成功
      Socket.emit('chat', Socket.id);
    });
  }

  return {
    fetchUserInfo,
    currentUser,
    allMessage,
    Socket: Socket,
    settings: defaultSettings,
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
        console.log('没登录');
      }
    },

    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;

      return (
        <Provider store={store}>
          {children}
          {/* {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({ ...preInitialState, settings }));
              }}
            />
          )} */}
        </Provider>
      );
    },
    ...initialState?.settings,
  };
};
