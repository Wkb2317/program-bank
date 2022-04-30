import { memo, useEffect, useState, useRef } from 'react';
import { Table, Space, Modal, Input, message, Switch, Popconfirm, Card } from 'antd';
import dayjs from 'dayjs';
import style from './index.less';
import { getAllUser, changeUserAccess } from '@/services/ant-design-pro/review';

const UserManage = memo(() => {
  const userId = localStorage.getItem('uuid');
  const [AllUserData, setAllUserData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const res = await getAllUser(userId);
    if (res.code) {
      setAllUserData((e) => res.data);
    } else {
      message.error(res.msg);
    }
  }, []);

  useEffect(() => {
    changeTableData();
  }, [AllUserData]);

  const changeTableData = () => {
    if (AllUserData.length) {
      console.log(AllUserData);
      let newData = AllUserData.map((item) => {
        item.registerTime = dayjs(item.registerTime).format('YYYY-MM-DD HH:mm:ss');
        item.key = item.id;
        return item;
      });
      setTableData((e) => newData);
    }
    setLoading(false);
  };

  const onChangeAccess = async (checked, changeUserId, index) => {
    console.log(checked, changeUserId);
    const res = await changeUserAccess(changeUserId, checked);
    if (res.code) {
      let newTable = _.cloneDeep(tableData);
      newTable[index].access === 'admin'
        ? (newTable[index].access = 'user')
        : (newTable[index].access = 'admin');
      setTableData((e) => newTable);
      message.success(res.msg);
      return;
    }
    message.error(res.msg);
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
      title: '班级',
      align: 'center',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: '邮箱',
      align: 'center',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '注册时间',
      align: 'center',
      dataIndex: 'registerTime',
      key: 'registerTime',
    },
    {
      title: '积分',
      align: 'center',
      dataIndex: 'integration',
      key: 'integration',
    },
    {
      title: '管理员',
      key: 'access',
      align: 'center',
      render: (text, record, index) => (
        <Space size="middle">
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={record.access === 'admin' ? true : false}
            onChange={(checked) => onChangeAccess(checked, record.id, index)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card title="用户管理">
      <Table
        pagination={{ pageSize: 5 }}
        loading={loading}
        columns={columns}
        dataSource={tableData}
      />
    </Card>
  );
});

export default UserManage;
