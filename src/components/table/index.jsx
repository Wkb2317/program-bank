import { memo, useEffect, useState, useRef } from 'react';
import { Table, Space, Modal, Input, message } from 'antd';
import dayjs from 'dayjs';
import style from './index.less';
import { saveMark } from '@/services/ant-design-pro/question';

const { TextArea } = Input;

const MyTable = memo((props) => {
  let { submitHistory } = props;
  const userId = localStorage.getItem('uuid');

  const [submit, setSubmit] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [isMarkModalVisible, setIsMarkModalVisible] = useState(false);
  const [mark, setMark] = useState('');
  const markRef = useRef();

  useEffect(() => {
    setSubmit((_) => submitHistory);
  }, [submitHistory]);

  useEffect(() => {
    changeData();
  }, [submit]);

  const changeData = () => {
    let newData = [];
    if (Object.keys(submit).length) {
      newData = submit.map((item, index) => {
        item.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss');
        item.key = index;
        return item;
      });
    }
    setData((_) => newData);
    setLoading((_) => false);
  };

  const showMarkModal = (record) => {
    console.log(markRef);
    markRef.current = record.mark_id;
    submit.find((item) => {
      if (item.mark_id === record.mark_id) {
        setMark((_) => item.mark);
        return item;
      }
    });
    setIsMarkModalVisible(true);
  };

  const handleMarkOk = async () => {
    const res = await saveMark(markRef.current, mark);
    if (res.code) {
      let newSubmit = submit.map((item) => {
        if (item.mark_id === markRef.current) {
          item.mark = mark;
        }
        return item;
      });
      setSubmit((_) => newSubmit);
      setIsMarkModalVisible(false);
      message.success(res.msg);
      return;
    }
    console.log(res);
  };

  const handleMarkCancel = () => {
    setIsMarkModalVisible(false);
  };

  const onInputMark = (e) => {
    setMark((_) => e.target.value);
  };

  const columns = [
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className={style.avatarWrapper}>
          <img className={style.avatar} src={record.avatar} alt="" />
          <span className={style.name}>{text}</span>
        </div>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'time',
      align: 'center',
      key: 'time',
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'mark',
      key: 'mark',
      render: (text, record) => (
        <div className={style.markWrapper} onClick={(e) => showMarkModal(record)}>
          <i className={['iconfont', , record.mark ? 'icon-beizhu' : 'icon-beizhu1'].join(' ')}></i>
          <span className={[record.mark ? style.hasMark : style.noMark].join(' ')}>
            {record.mark ? record.mark : '添加备注'}
          </span>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          <a>查看代码 </a>
          <a>删除记录</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table loading={loading} columns={columns} dataSource={data} />;
      <Modal
        title="添加备注"
        centered
        bodyStyle={{
          height: 200,
        }}
        visible={isMarkModalVisible}
        onOk={handleMarkOk}
        okText="保存"
        onCancel={handleMarkCancel}
      >
        <TextArea
          value={mark}
          showCount
          maxLength={100}
          style={{ height: 150 }}
          onChange={onInputMark}
        />
      </Modal>
    </div>
  );
});

export default MyTable;
