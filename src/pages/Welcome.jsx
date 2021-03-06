import { memo, useEffect, useState } from 'react';
import { history } from 'umi';
import { notification, Layout, Space, message, Tag, Button, Tooltip, Card, Row, Col } from 'antd';
import ProList from '@ant-design/pro-list';
import { SmileOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { getLoginIntegration, getWeekRank } from '@/services/ant-design-pro/user';
import style from './Welcome.less';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import tags from '../../config/tags';
import TagOfDesign from '@/components/tag';
import { getQuestionAction } from '../store/question/actions';
import { collectQuestion } from '@/services/ant-design-pro/question';
import { copy } from '@/utils/tools';
import moment from 'moment';

const { Content } = Layout;

const Welcome = memo(() => {
  const uuid = localStorage.getItem('uuid');
  const dispatch = useDispatch();
  const [currentTag, setCurrentTag] = useState(0);
  const [cardActionProps, setCardActionProps] = useState('actions');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [easyQuestions, setEasyQuestions] = useState([]);
  const [mediumQuestions, setMediumQuestions] = useState([]);
  const [difficultQuestions, setDifficultQuestions] = useState([]);
  const [weekRank, setWeekRank] = useState(null);

  const tagColor = ['#5BD8A6', '#FF9900', '#FF0033'];

  let { easy, medium, difficult } = useSelector(
    (state) => ({
      easy: state.getIn(['Question', 'easy']),
      medium: state.getIn(['Question', 'medium']),
      difficult: state.getIn(['Question', 'difficult']),
    }),
    shallowEqual,
  );

  useEffect(() => {
    setEasyQuestions(easy);
    setMediumQuestions(medium);
    setDifficultQuestions(difficult);
  }, [easy, medium, difficult]);

  const typeQuestions = [easyQuestions, mediumQuestions, difficultQuestions];

  useEffect(() => {
    uuid && isFirstLoginToday(uuid);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getQuestionAction(uuid, currentTag));
  }, [dispatch, currentTag]);

  useEffect(() => {
    setLoading(true);
    setData(
      (e) =>
        typeQuestions[currentTag] &&
        typeQuestions[currentTag].map((item) => ({
          title: item.title,
          subTitle: <Tag color={tagColor[item.type]}>{tags[item.type].name}</Tag>,
          actions: [
            <a key="run" onClick={(e) => onCollectQuestion(item.id)}>
              <Tooltip title={item.user_id ? '????????????' : '??????'} placement="top">
                <i
                  className={['iconfont', item.user_id ? 'icon-shoucang1' : 'icon-shoucang'].join(
                    ' ',
                  )}
                ></i>
                {item.collect ? item.collect : 0}
              </Tooltip>
            </a>,
            <a key="share" onClick={(e) => shareQuestion(item.id)}>
              <Tooltip title="??????" placement="top">
                <ShareAltOutlined />
              </Tooltip>
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

  useEffect(async () => {
    const weekOfday = moment().format('E'); //??????????????????????????????
    const last_monday = moment()
      .subtract(weekOfday - 1, 'days')
      .format('YYYY-MM-DD'); //????????????
    const last_sunday = moment()
      .add(7 - weekOfday, 'days')
      .format('YYYY-MM-DD'); //????????????

    let res = await getWeekRank(last_monday, last_sunday);
    if (!res.code) {
      setWeekRank((_) => null);
      message.error(res.msg);
      return;
    }
    setWeekRank((_) => res.data);
  }, []);

  const isFirstLoginToday = async (uuid) => {
    let res = await getLoginIntegration(uuid);
    let message = '????????????';
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

  const onCollectQuestion = async (id) => {
    const newQuestion = typeQuestions[currentTag].map((item) => {
      if (item.id == id) {
        if (item.user_id) {
          item.user_id = null;
          item.collect = item.collect - 1;
        } else {
          item.user_id = uuid;
          item.collect = item.collect + 1;
        }
      }
      return item;
    });
    switch (currentTag) {
      case 0:
        setEasyQuestions(newQuestion);
        break;
      case 1:
        setMediumQuestions(newQuestion);
        break;
      case 2:
        setDifficultQuestions(newQuestion);
        break;
    }
    const res = await collectQuestion(uuid, id);
    if (!res.code) {
      message.error('???????????????????????????????????????!');
      return;
    }
  };

  const shareQuestion = (id) => {
    copy(`${location.href}\\detail\\${id}`);
  };

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
        <Row
          style={{
            backgroundColor: '#eee',
            marginTop: 20,
          }}
          gutter={{ xs: 10, sm: 16, md: 24 }}
          wrap={true}
        >
          <Col xs={24} lg={18}>
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
              // showExtra="allways"
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
              headerTitle="????????????"
              dataSource={data}
            />
          </Col>
          <Col xs={24} lg={6}>
            <Card
              title="????????????"
              bordered={false}
              style={{ width: '100%' }}
              extra={<a href="/world/rank">??????</a>}
            >
              {weekRank &&
                weekRank.map((item, index) => (
                  <div key={item.id} className={style.totalRank}>
                    <div className={style.userinfo}>
                      <img
                        onClick={(e) => openChartDiaLog(item.id)}
                        className={style.avatar}
                        src={item.avatar}
                        alt=""
                      />
                      <div>
                        <div>
                          <span>{item?.name}</span>
                          <span style={{ marginLeft: 10 }}>{item?.class}</span>
                        </div>
                        <div>??????: {item.value}</div>
                      </div>
                    </div>
                    <div>Top {index + 1}</div>
                  </div>
                ))}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
});

export default Welcome;
