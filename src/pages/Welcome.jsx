import { memo, useEffect, useState } from 'react';
import { history } from 'umi';
import { notification, Layout, Space, Progress, Tag, Button, Popover } from 'antd';
import ProList from '@ant-design/pro-list';
import { SmileOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { getLoginIntegration } from '@/services/ant-design-pro/user';
import style from './Welcome.less';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import tags from '../../config/tags';
import TagOfDesign from '@/components/tag';
import { getQuestionAction } from '../store/question/actions';

const { Content } = Layout;

const Welcome = memo(() => {
  const uuid = localStorage.getItem('uuid');
  const dispatch = useDispatch();
  const [currentTag, setCurrentTag] = useState(0);
  const [cardActionProps, setCardActionProps] = useState('actions');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const tagColor = ['#5BD8A6', '#FF9900', '#FF0033'];

  const { easyQuestions, mediumQuestions, difficultQuestions } = useSelector(
    (state) => ({
      easyQuestions: state.getIn(['Question', 'easy']),
      mediumQuestions: state.getIn(['Question', 'medium']),
      difficultQuestions: state.getIn(['Question', 'difficult']),
    }),
    shallowEqual,
  );

  useEffect(() => {
    uuid && isFirstLoginToday(uuid);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getQuestionAction(currentTag));
  }, [dispatch, currentTag]);

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

  useEffect(() => {
    const typeQuestions = [easyQuestions, mediumQuestions, difficultQuestions];
    setData(
      (e) =>
        typeQuestions[currentTag] &&
        typeQuestions[currentTag].map((item) => ({
          title: item.title,
          subTitle: <Tag color={tagColor[item.type]}>{tags[item.type].name}</Tag>,
          actions: [
            <a key="run">
              <Popover content="收藏" trigger="hover">
                <HeartOutlined />
                {item.collect}
              </Popover>
            </a>,
            <a key="share">
              <Popover content="分享" trigger="hover">
                <ShareAltOutlined />
              </Popover>
            </a>,
          ],
          id: item.id,
          content: (
            <div
              style={{
                flex: 1,
                padding: 0,
              }}
            >
              <div
                style={{
                  padding: 0,
                }}
              >
                <div>{item.detail}</div>
              </div>
            </div>
          ),
        })),
    );
    setLoading(false);
  }, [currentTag, easyQuestions, mediumQuestions, difficultQuestions]);

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
            loading={loading}
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
                onClick: () => {
                  history.push(`/question/detail/${record.id}`);
                },
              };
            }}
            metas={{
              title: {},
              subTitle: {},
              type: {},
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
