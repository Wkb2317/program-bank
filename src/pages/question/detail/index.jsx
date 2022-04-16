import { memo } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Layout, Spin, Space, Progress, Tag, Button, Popover } from 'antd';
import style from './index.less';
import { getQuestionDetailAction } from '@/store/question/actions';
import { useEffect } from 'react';

const { Content } = Layout;

const Detail = memo((props) => {
  const { id } = props.match.params;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getQuestionDetailAction(id));
  }, [dispatch]);

  const { questionDetail } = useSelector(
    (state) => ({
      questionDetail: state.getIn(['Question', 'questionDetail']),
    }),
    shallowEqual,
  );

  console.log(questionDetail);

  const Loading = () => {
    return (
      <div className={style.loading}>
        <Spin />
      </div>
    );
  };

  return (
    <Layout>
      <Content className={style.wrapper}>
        {questionDetail ? (
          <div className={style.content}>
            <div className={style.header}>
              <span className={style.title}>{questionDetail.title}</span>
            </div>
          </div>
        ) : (
          <Loading></Loading>
        )}

        <div className={style.code}>code</div>
      </Content>
    </Layout>
  );
});

export default Detail;
