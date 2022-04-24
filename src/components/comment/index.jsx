import { memo, useState, useEffect, dangerouslySetInnerHTML } from 'react';
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Comment, Tooltip, List, Button, message, Popconfirm, Avatar } from 'antd';
import Editor from '../editor';
import {
  submitComment,
  getComment,
  likeComment,
  deleteComment,
  submitReply,
  getReply,
  deleteReply,
} from '@/services/ant-design-pro/comment';
import getDateDiff from '@/utils/getDateDiff';
import moment from 'moment';
import style from './index.less';
import _ from 'lodash';

export default memo((props) => {
  const [comment, setComment] = useState([]);
  const [formatComment, setFormatComment] = useState([]);
  const [isShowReply, setIsShowReply] = useState([]);
  const [isShowComment, setIsShowComment] = useState([]);

  const { id } = props;
  const userId = localStorage.getItem('uuid');

  // setTimeout(() => {
  //   const toolbar = DomEditor.getToolbar(editor);
  //   console.log(toolbar.getConfig().toolbarKeys);
  // }, 2000);

  useEffect(() => {
    getAllComment();
  }, []);

  useEffect(() => {
    setIsShowReply((e) => e.fill(false, 0, comment.length));
    setIsShowComment((e) => e.fill(false, 0, comment.length));
    changeComment(comment);
  }, [comment]);

  const getAllComment = async () => {
    const res = await getComment(userId, id);
    setComment((e) => res.data);
  };

  const controlEditorShow = (index) => {
    let newShowReply = isShowReply;
    newShowReply[index] = !newShowReply[index];
    setIsShowReply((e) => newShowReply);
    changeComment(comment);
  };

  const controlCommentShow = (reply, index) => {
    let newShowComment = isShowComment;
    newShowComment[index] = !newShowComment[index];
    setIsShowComment((e) => newShowComment);
    let newComment = _.cloneDeep(comment);
    newComment[index].children = reply;
    changeComment(newComment);
  };

  const onGetReply = async (commentId, index) => {
    const res = await getReply(commentId);
    if (res.code) {
      console.log(res.data);
      controlCommentShow(res.data, index);
    }
  };

  const onCloseReply = (index) => {
    isShowComment[index] = !isShowComment[index];
    setIsShowComment((e) => isShowComment);
    changeComment(comment);
  };

  const onReply = (comment_id, index) => {
    controlEditorShow(index);
  };

  const onDeleteReply = async (reply_index, reply_id, index) => {
    const res = await deleteReply(reply_index);
    if (res.code) {
      message.success('删除成功！');
      onGetReply(reply_id, index);
    }
    message.error(res.msg);
  };

  const onCancel = (index) => {
    controlEditorShow(index);
  };

  const onSubmitReply = _.debounce(async (editor, html, commentId) => {
    if (!editor.getText().trim()) {
      message.error('请输入内容...');
      return;
    }
    const res = await submitReply(commentId, userId, html);
    if (res.code) {
      message.success(res.msg);
      getAllComment();
    } else {
      message.error(res.msg);
    }
  }, 300);

  const changeComment = (data) => {
    setFormatComment((_) =>
      data.map((item, index) => {
        let temp = {};
        temp.actions = isShowReply[index]
          ? [
              <Editor
                submit={(editor, html) => onSubmitReply(editor, html, item.comment_id)}
                onCancel={(e) => onCancel(index)}
                isShowCancel={true}
                confirmText={'回复'}
              ></Editor>,
            ]
          : [
              <span onClick={(e) => like(item.comment_id)}>
                {item.isLike ? <LikeFilled></LikeFilled> : <LikeOutlined></LikeOutlined>}
                <span className={style.margL3}>{item.zan_count}</span>
              </span>,
              item.reply_count ? (
                !isShowComment[index] ? (
                  <span
                    onClick={(e) => onGetReply(item.comment_id, index)}
                    className={style.margL5}
                  >
                    <MessageOutlined />
                    <span className={style.margL3}>查看{item.reply_count}条回复</span>
                  </span>
                ) : (
                  <span onClick={(e) => onCloseReply(index)} className={style.margL5}>
                    <MessageOutlined />
                    <span className={style.margL3}>关闭回复</span>
                  </span>
                )
              ) : (
                ''
              ),
              <span onClick={(e) => onReply(item.comment_id, index)} className={style.margL5}>
                <FormOutlined />
                <span className={style.margL3}>回复</span>
              </span>,
              item.user_id === userId ? (
                <Popconfirm
                  onConfirm={(e) => onDeleteComment(item.comment_id)}
                  title="确认删除吗？"
                  okText="删除"
                  cancelText="取消"
                >
                  <span className={style.margL5}>
                    <DeleteOutlined />
                    <span className={style.margL3}>删除</span>
                  </span>
                </Popconfirm>
              ) : (
                ''
              ),
            ];
        temp.avatar = item.avatar;
        temp.author = item.name;
        temp.content = <p dangerouslySetInnerHTML={{ __html: item.content }}></p>;
        temp.datetime = (
          <Tooltip title={moment(item.comment_time).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{getDateDiff(item.comment_time)}</span>
          </Tooltip>
        );
        temp.children = (
          <>
            {isShowComment[index]
              ? item?.children
                ? item.children.map((item, cindex) => {
                    return (
                      <Comment
                        key={cindex}
                        content={<p dangerouslySetInnerHTML={{ __html: item.reply_content }}></p>}
                        author={item.name}
                        avatar={item.avatar}
                        actions={[
                          item.from_userid === userId ? (
                            <Popconfirm
                              onConfirm={(e) =>
                                onDeleteReply(item.reply_index, item.reply_id, index)
                              }
                              title="确认删除吗？"
                              okText="删除"
                              cancelText="取消"
                            >
                              <span className={style.margL5}>
                                <DeleteOutlined />
                                <span className={style.margL3}>删除</span>
                              </span>
                            </Popconfirm>
                          ) : (
                            ''
                          ),
                        ]}
                      ></Comment>
                    );
                  })
                : ''
              : ''}
          </>
        );
        return temp;
      }),
    );
  };

  const submit = _.debounce(async (editor, html) => {
    if (!editor.getText().trim()) {
      message.error('请输入内容...');
      return;
    }
    const res = await submitComment(userId, id, html);
    if (res.code) {
      message.success(res.msg);
      getAllComment();
    } else {
      message.error(res.msg);
    }
  }, 300);

  const like = _.debounce(async (commentId) => {
    const res = await likeComment(userId, commentId);
    if (res.code) {
      setComment((e) =>
        comment.map((item) => {
          if (item.comment_id === commentId) {
            if (item.isLike) {
              item.isLike = 0;
              item.zan_count = item.zan_count - 1;
            } else {
              item.isLike = 1;
              item.zan_count = item.zan_count + 1;
            }
          }
          return item;
        }),
      );
    } else {
      message.error(res.msg);
    }
  }, 300);

  const onDeleteComment = async (commentId) => {
    const res = await deleteComment(commentId);
    console.log(res);
    if (res.code) {
      message.success(res.msg);
      setComment((e) => comment.filter((item) => item.comment_id !== commentId));
    } else {
      message.error(res.msg);
    }
  };

  return (
    <>
      <Editor submit={submit} isShowCancel={false} confirmText={'回复'}></Editor>
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
              children={item.children}
            ></Comment>
          </li>
        )}
      />
    </>
  );
});
