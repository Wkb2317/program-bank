import { memo, useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import _ from 'lodash';
import {
  Card,
  List,
  Tooltip,
  Tag,
  Modal,
  Form,
  Input,
  Button,
  Space,
  Popconfirm,
  message,
} from 'antd';
import { ExportOutlined, AudioOutlined } from '@ant-design/icons';
import { getCollectQuestion, collectQuestion } from '@/services/ant-design-pro/question';
import { tagColor } from '../../../../config/constant';

const { Search } = Input;

const Collect = memo(() => {
  const userId = localStorage.getItem('uuid');
  const [collectData, setCollectData] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(async () => {
    const res = await getCollectQuestion(userId);
    if (res.code) {
      setCollectData(res.data);
    } else {
      message.error(res.msg);
    }
  }, []);

  useEffect(() => {
    if (collectData) {
      let data = [];
      collectData.forEach((item) => {
        data.push({
          ...item,
        });
      });
      setDataSource((e) => data);
    }
  }, [collectData]);

  const onCollectQuestion = async (questionId, index) => {
    const res = await collectQuestion(userId, questionId);
    if (res.code) {
      let newData = _.cloneDeep(dataSource);
      newData[index].is_collect = newData[index].is_collect ? 0 : 1;
      setDataSource((e) => newData);
    } else {
      message.error(res.msg);
    }
  };

  const onSearch = (value) => {
    let searchRes = [];
    dataSource.forEach((item) => {
      if (item.title.includes(value)) {
        searchRes.push(item);
      }
    });
    if (searchRes.length) {
      setDataSource((e) => searchRes);
    } else {
      message.error('没有搜索到相关题目');
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case '0':
        return <Tag color={tagColor[0]}>简单</Tag>;
      case '1':
        return <Tag color={tagColor[1]}>中等</Tag>;
      case '2':
        return <Tag color={tagColor[2]}>困难</Tag>;
    }
  };

  return (
    <Card title="题目收藏">
      <List
        size="large"
        header={
          <Search
            style={{ width: 250 }}
            placeholder="输入题目名称"
            onSearch={onSearch}
            enterButton
          />
        }
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        bordered
        dataSource={dataSource}
        renderItem={(item, index) => (
          <List.Item
            key={item.id}
            actions={[
              <a
                key="list-loadmore-edit"
                onClick={(e) => history.push(`/question/detail/${item.question_id}`)}
              >
                <Tooltip title={'查看详情'} placement="top">
                  <ExportOutlined />
                </Tooltip>
              </a>,
              <a key="run" onClick={(e) => onCollectQuestion(item.question_id, index)}>
                <Tooltip title={item.is_collect ? '取消收藏' : '收藏'} placement="top">
                  <i
                    className={[
                      'iconfont',
                      item.is_collect ? 'icon-shoucang1' : 'icon-shoucang',
                    ].join(' ')}
                  ></i>
                </Tooltip>
              </a>,
            ]}
          >
            <List.Item.Meta
              title={
                <a
                  style={{ fontWeight: 'bolder' }}
                  onClick={(e) => history.push(`/question/detail/${item.question_id}`)}
                >
                  {renderIcon(item.type)}
                  {item.title}
                </a>
              }
            />
            {item.detail}
          </List.Item>
        )}
      />
    </Card>
  );
});

export default Collect;
