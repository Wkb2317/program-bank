import { Space, Popconfirm } from 'antd';

export const columns = [
  {
    title: '题目',
    align: 'center',
    dataIndex: 'title',
    key: 'name',
  },
  {
    title: '详情',
    align: 'center',
    dataIndex: 'detail',
    key: 'detail',
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
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (text, record) => (
      <Space size="middle">
        <a onClick={(e) => viewCode(record.mark_id)}>查看代码 </a>

        <Popconfirm
          onConfirm={(e) => deleteHistory(record.mark_id)}
          title="确认删除吗？"
          okText="删除"
          cancelText="取消"
        >
          <a> 删除记录</a>
        </Popconfirm>
      </Space>
    ),
  },
];
