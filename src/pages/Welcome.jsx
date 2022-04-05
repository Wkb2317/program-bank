import { memo, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { notification, Layout, Space, Progress, Tag, Button, Popover } from 'antd';
import ProList from '@ant-design/pro-list';
import { SmileOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { getLoginIntegration } from '@/services/ant-design-pro/user';
import style from './Welcome.less';
import { useDispatch } from 'react-redux';
import tags from '../../config/tags';
import TagOfDesign from '@/components/tag';

const { Header, Footer, Content } = Layout;

const Welcome = memo(() => {
  const uuid = localStorage.getItem('uuid');
  const dispatch = useDispatch();
  const [currentTag, setCurrentTag] = useState(0);
  const [cardActionProps, setCardActionProps] = useState('actions');

  useEffect(() => {
    uuid && isFirstLoginToday(uuid);
  }, [dispatch]);

  const isFirstLoginToday = async (uuid) => {
    let res = await getLoginIntegration(uuid);
    let message = '欢迎回来';
    let description = res.msg;
    res.code &&
      notification.open({
        message,
        description,
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
  };

  const tagsChang = (tagId) => {
    setCurrentTag((e) => tagId);
  };

  const data = [
    '二叉树',
    '动态规划',
    '红黑树',
    '贪心算法',
    '广度优先遍历',
    '深度优先遍历',
    '冒泡排序',
    '快速排序',
  ].map((item) => ({
    title: item,
    subTitle: <Tag color="#5BD8A6">语雀专栏</Tag>,
    actions: [
      <a key="run">
        <Popover content="收藏" trigger="hover">
          <HeartOutlined />
        </Popover>
      </a>,
      <a key="delete">
        <Popover content="分享" trigger="hover">
          <ShareAltOutlined />
        </Popover>
      </a>,
    ],
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
      <div
        style={{
          flex: 1,
          padding: 0,
        }}
      >
        <div
          style={{
            width: 200,
            padding: 0,
          }}
        >
          <div>发布中</div>
          <Progress percent={80} />
        </div>
      </div>
    ),
  }));

  return (
    <Layout>
      <Content style={{ padding: 20 }}>
        <Space wrap>
          {tags.map((item) => {
            return (
              <TagOfDesign
                onTagClick={(e) => tagsChang(item.id)}
                title={item.name}
                id={item.id}
                currentTag={currentTag}
                key={item.id}
              ></TagOfDesign>
            );
          })}
        </Space>

        <div
          style={{
            backgroundColor: '#eee',
            marginTop: 20,
          }}
        >
          <ProList
            ghost={false}
            itemCardProps={{
              ghost: false,
            }}
            className={style.padding_0}
            pagination={{
              defaultPageSize: 8,
              showSizeChanger: false,
            }}
            showActions="allways"
            showExtra="allways"
            rowSelection={{}}
            grid={{
              gutter: 16,
              column: 3,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            onItem={(record) => {
              return {
                onMouseEnter: () => {
                  console.log(record);
                },
                onClick: () => {
                  console.log(record);
                },
              };
            }}
            metas={{
              title: {},
              subTitle: {},
              type: {},
              avatar: {},
              content: {},
              actions: {
                cardActionProps,
              },
            }}
            headerTitle="题目列表"
            dataSource={data}
          />
        </div>
      </Content>
    </Layout>
  );
});

export default Welcome;
