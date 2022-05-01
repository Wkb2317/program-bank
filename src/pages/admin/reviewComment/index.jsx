import { memo, useEffect, useState, useRef } from 'react';
import {
  Card,
  List,
  Avatar,
  Button,
  Skeleton,
  Table,
  Space,
  Modal,
  Input,
  message,
  Popconfirm,
} from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { getCommentAndReply, deleteComment, passComment } from '@/services/ant-design-pro/review';
import dayjs from 'dayjs';

const ReviewComment = memo(() => {
  const [commentData, setCommentData] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const res = await getCommentAndReply();
    if (res.code) {
      setCommentData((e) => res.data);
      return;
    }
    message.error(res.msg);
  }, []);

  useEffect(() => {
    if (commentData.length) {
      let newList = commentData.map((item) => {
        return item;
      });
      setList((e) => newList);
    }
    setLoading(false);
  }, [commentData]);

  const onDeleteComment = async (record, index) => {
    let type = 'reply';
    let id = record?.reply_id;
    if (record?.comment_id) {
      type = 'comment';
      id = record.comment_id;
    }
    const res = await deleteComment(id, type);
    if (res.code) {
      let newList = _.cloneDeep(list);
      newList.splice(index, 1);
      setList((e) => newList);
      message.success(res.msg);
      return;
    }
    message.error(res.msg);
  };

  const onPassComment = async (record, index) => {
    let type = 'reply';
    let id = record?.reply_id;
    if (record?.comment_id) {
      type = 'comment';
      id = record.comment_id;
    }
    const res = await passComment(id, type);
    if (res.code) {
      let newList = _.cloneDeep(list);
      newList[index].pass = true;
      setList((e) => newList);
      message.success(res.msg);
      return;
    }
    message.error(res.msg);
  };

  return (
    <Card title="评论审核">
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <a>{item.pass ? <CheckOutlined /> : ''}</a>,
              <a key="list-loadmore-edit" onClick={(e) => onPassComment(item, index)}>
                通过
              </a>,
              <Popconfirm
                onConfirm={(e) => onDeleteComment(item, index)}
                title="确认删除吗？"
                okText="删除"
                cancelText="取消"
              >
                <a>删除评论</a>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={
                <a>
                  {item.name} {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                </a>
              }
            />
            <div>
              <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
});

export default ReviewComment;
