import { memo, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/perl/perl.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/clike/clike.js';
import { Layout, Spin, message, Tabs, Rate, Space, Progress, Tag, Button, Popover } from 'antd';
import { SmileOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import style from './index.less';
import { getQuestionDetailAction } from '@/store/question/actions';
import tags from '../../../../config/tags';

const { TabPane } = Tabs;
const { Content } = Layout;

const Detail = memo((props) => {
  const { id } = props.match.params;
  const dispatch = useDispatch();
  const tagColor = ['#5BD8A6', '#FF9900', '#FF0033'];

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

  const shareQuestion = () => {
    navigator.clipboard.writeText(location.href).then(
      function () {
        message.success('复制成功,快分享给你的小伙伴吧!', 3);
      },
      function (err) {
        console.log(err);
        message.error('复制失败，请手动复制链接!', 3);
      },
    );
  };

  function callback(key) {
    console.log(key);
  }

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
        {Object.keys(questionDetail).length ? (
          <div className={style.content}>
            <div className={style.header}>
              <div>
                <span className={style.title}>{questionDetail.title}</span>
                <Tag style={{ marginLeft: 10 }} color={tagColor[parseInt(questionDetail.type)]}>
                  {tags[questionDetail.type].name}
                </Tag>
              </div>
              <div className={style.right}>
                <span className={style.iconBg}>
                  <i className="iconfont icon-shoucang"></i>
                </span>
                <span className={style.iconBg} onClick={shareQuestion}>
                  <i className="iconfont icon-fenxiang"></i>
                </span>
              </div>
            </div>

            <Tabs onChange={callback} type="card" className={style.tabCard}>
              <TabPane tab="题目" key="detail">
                <div className={style.detail}>{questionDetail.detail}</div>
              </TabPane>
              <TabPane tab="评论" key="comment">
                评论
              </TabPane>
              <TabPane tab="提交记录" key="history">
                提交记录
              </TabPane>
            </Tabs>
          </div>
        ) : (
          <Loading></Loading>
        )}

        <div className={style.code}>
          <CodeMirror
            className={style.codeMirror}
            value=""
            options={{
              lineNumbers: true,
              mode: {
                name: 'text/javascript',
                name: 'text/x-csrc',
                name: 'text/x-c++src',
                name: 'text/x-cython',
                name: 'text/x-java',
              },
              theme: 'material',
              extraKeys: { Ctrl: 'autocomplete' },
              autofocus: true,
              styleActiveLine: true,
              lineWrapping: true,
              foldGuter: true,
              gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            }}
          ></CodeMirror>
          <div className={style.footer}>
            <Button type="primary">保存并提交</Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
});

export default Detail;
