import { GlobalOutlined } from '@ant-design/icons';
export default [
  {
    path: '/',
    redirect: '/question',
  },
  {
    path: '/question',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/question',
    routes: [
      {
        path: '/question/detail/:id',
        component: './question/detail',
      },
    ],
  },

  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './admin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/review',
      },
      {
        name: 'review',
        path: '/admin/review',
        component: './admin/reviewQuestion',
      },
      {
        name: 'userManage',
        path: '/admin/userManage',
        component: './admin/userManage',
      },
      {
        name: 'reviewComment',
        path: '/admin/comment',
        component: './admin/reviewComment',
      },
      {
        component: './404',
      },
    ],
  },

  {
    path: '/account',
    name: 'account',
    icon: 'user',
    component: './account/center',
    routes: [
      {
        path: '/account',
        redirect: '/account/profile',
      },
      {
        name: 'profile',
        path: '/account/profile',
        component: './account/profile',
        icon: 'CrownOutlined',
      },
      {
        name: 'score',
        path: '/account/score',
        component: './account/score',
        icon: 'UserOutlined',
      },
      {
        name: 'message',
        path: '/account/message',
        component: './account/message',
        icon: 'SmileOutlined',
      },
      {
        name: 'collect',
        path: '/account/collect',
        component: './account/collect',
        icon: 'SmileOutlined',
      },
    ],
  },
  {
    name: 'world',
    icon: 'GlobalOutlined',
    path: '/world',
    component: './world',
    routes: [
      {
        path: '/world',
        redirect: '/world/discuss',
      },
      {
        name: 'discuss',
        path: '/world/discuss',
        component: './world/discuss',
      },
      {
        name: 'rank',
        path: '/world/rank',
        component: './world/rank',
      },
    ],
  },

  {
    name: 'uploadQuestion',
    icon: 'UploadOutlined',
    path: '/upload',
    component: './uploadQuestion',
    routes: [
      {
        path: '/upload',
        redirect: '/upload/question',
      },
      {
        path: '/upload/question',
        name: 'upload',
        component: './uploadQuestion/upload',
      },
      {
        path: '/upload/history',
        name: 'history',
        component: './uploadQuestion/history',
      },
    ],
  },

  {
    component: './404',
  },
];
