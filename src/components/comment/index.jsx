import { memo, useState, useEffect, createElement, dangerouslySetInnerHTML } from 'react';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { Comment, Tooltip, List, Button, message } from 'antd';
import moment from 'moment';
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, DomEditor } from '@wangeditor/editor';
import { toolbarConfig } from './config';
import { submitComment, getComment } from '@/services/ant-design-pro/comment';

export default memo((props) => {
  const { id } = props;
  const userId = localStorage.getItem('uuid');
  const [editor, setEditor] = useState(IDomEditor); // 存储 editor 实例
  const [html, setHtml] = useState(''); // 编辑器内容
  const [comment, setComment] = useState([]);
  const [formatComment, setFormatComment] = useState([]);

  useEffect(() => {
    getAllComment();
  }, []);

  useEffect(() => {
    changeComment();
  }, [comment]);

  const getAllComment = async () => {
    const res = await getComment(userId, id);
    setComment(res.data);
  };

  const changeComment = () => {
    setFormatComment((_) =>
      comment.map((item, index) => {
        let temp = {};
        temp.actions = [
          <span onClick={like}>
            <LikeOutlined></LikeOutlined>
            <span className="comment-action">{100}</span>
          </span>,
          <span key="comment-list-reply-to-0">回复</span>,
        ];

        temp.avatar = item.avatar;
        temp.author = item.name;

        temp.content = <p dangerouslySetInnerHTML={{ __html: item.content }}></p>;
        temp.datetime = (
          <Tooltip title={moment(item.time).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().subtract(1, 'days').fromNow()}</span>
          </Tooltip>
        );
        return temp;
      }),
    );
  };

  const submit = _.debounce(async () => {
    if (!editor.getText()) {
      message.error('请输入内容...');
      return;
    }
    const res = await submitComment(userId, id, html);
    if (res.code) {
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
  }, 300);

  const editorConfig = {
    placeholder: '请输入内容...',
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const like = () => {
    console.log('like');
  };

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '200px', overflowY: 'auto' }}
        />
      </div>
      <Button style={{ marginTop: 10 }} onClick={submit} type="primary">
        提交
      </Button>
      <List
        className="comment-list"
        header={`${comment.length} 条评论`}
        itemLayout="horizontal"
        dataSource={formatComment}
        renderItem={(item) => (
          <li>
            <Comment
              actions={item.actions}
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            />
          </li>
        )}
      />
    </>
  );
});
