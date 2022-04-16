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
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
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
        path: '/account/profile',
        component: './account/profile',
      },
      {
        path: '/account/score',
        component: './account/score',
      },
      {
        path: '/account/rank',
        component: './account/rank',
      },
    ],
  },
  {
    name: 'world',
    icon: 'GlobalOutlined',
    path: '/world',
    component: './world',
  },

  {
    component: './404',
  },
];
