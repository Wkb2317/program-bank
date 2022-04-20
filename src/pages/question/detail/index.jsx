import { memo, useEffect, useRef, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/perl/perl.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/anyword-hint.js';

import { Layout, Spin, message, Tabs, Rate, Space, Progress, Tag, Button, Popover } from 'antd';
import { SmileOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { getQuestionDetail, collectQuestion } from '@/services/ant-design-pro/question';
import { getQuestionDetailAction } from '@/store/question/actions';
import tags from '../../../../config/tags';
import style from './index.less';

const { TabPane } = Tabs;
const { Content } = Layout;

const Detail = memo((props) => {
  const userId = localStorage.getItem('uuid');
  const { id } = props.match.params;
  const tagColor = ['#5BD8A6', '#FF9900', '#FF0033'];

  const dispatch = useDispatch();
  const codeMirrorRef = useRef();
  const [questionDetail, setQuestionDetail] = useState({});
  const [isCollect, setIsCollect] = useState(0);

  useEffect(async () => {
    getQuestion(id);
    // dispatch(getQuestionDetailAction(id));
  }, []);

  const getQuestion = async (id) => {
    const res = await getQuestionDetail(userId, id);
    if (res.code) {
      setQuestionDetail(res.data[0]);
      res.data[0].is_collect ? setIsCollect(1) : setIsCollect(0);
    } else {
      message.error(res.msg);
    }
  };

  // const { questionDetail } = useSelector(
  //   (state) => ({
  //     questionDetail: state.getIn(['Question', 'questionDetail']),
  //   }),
  //   shallowEqual,
  // );

  const onCollectQuestion = async () => {
    const res = await collectQuestion(userId, id);
    if (!res.code) {
      message.error('系统出现故障，请联系管理员!');
      return;
    }

    setIsCollect(isCollect ? 0 : 1);
  };

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

  const onInputRead = (cm, change) => {
    console.log(cm);
    cm.showHint({
      completeSingle: false,
    });
    // codeMirrorRef.current.editor.showHint();
  };

  // 添加按键 ctrl-s自动保存
  codeMirrorRef?.current?.editor?.addKeyMap(
    {
      'Ctrl-S': function () {
        message.success('保存成功！');
        console.log('ctrls');
      },
    },
    false,
  );

  function onChangeTab(key) {
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
                <span className={style.iconBg} onClick={onCollectQuestion}>
                  <i
                    className={['iconfont', isCollect ? 'icon-shoucang1' : 'icon-shoucang'].join(
                      ' ',
                    )}
                  ></i>
                </span>
                <span className={style.iconBg} onClick={shareQuestion}>
                  <i className="iconfont icon-fenxiang"></i>
                </span>
              </div>
            </div>

            <Tabs onChange={onChangeTab} type="card" className={style.tabCard}>
              <TabPane tab="题目" key="detail">
                <div className={style.detail}>{questionDetail.detail}</div>
              </TabPane>
              <TabPane tab="评论" key="comment">
                讨论
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
            ref={codeMirrorRef}
            className={style.codeMirror}
            value="//Ctrl+S实时保存！"
            onInputRead={(cm, change, editor) => onInputRead(cm, change, editor)}
            options={{
              lineNumbers: true,
              mode: { name: 'javascript', globalVars: true },
              lineWrapping: true,
              foldGutter: true,
              gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
              theme: 'material',
              autofocus: true,
              styleActiveLine: true,
              lineWrapping: true,
              matchBrackets: true,
              foldGuter: true,
              autoCloseBrackets: true,
              extraKeys: {
                'Ctrl-M': 'autocomplete',
              }, //ctrl-space唤起智能提示
              smartIndent: true,
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
