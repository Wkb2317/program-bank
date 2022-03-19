import React, { memo, useState, useEffect } from 'react';
import { message } from 'antd';
import ProList from '@ant-design/pro-list';
import { getInegrationHistory } from '@/services/ant-design-pro/user';
import moment from 'moment';
import getDateDiff from '@/utils/getDateDiff';

const Score = memo(() => {
  const [integrationHistory, setIntegrationHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const type = {
    login: '每日登录',
    write: '解答题目',
  };

  useEffect(async () => {
    let res = await getInegrationHistory(localStorage.getItem('uuid'));
    if (res.code === 1) {
      setIntegrationHistory((e) =>
        res.data
          .sort((a, b) => {
            if (a.time > b.time) {
              return -1;
            }
            return 1;
          })
          .map((item) => ({
            title: `${type[item.type]} `,
            description: `+${item.value}`,
            content: (
              <div
                style={{
                  flex: 1,
                  height: 100,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 50,
                    textAlign: 'end',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div>{getDateDiff(moment(item.time))}</div>
                </div>
              </div>
            ),
          })),
      );

      setLoading(false);
    } else {
      message.error(res.msg);
    }
  }, []);

  return (
    integrationHistory && (
      <>
        <ProList
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
          }}
          metas={{
            title: {},
            description: {},
            type: {},
            content: {},
          }}
          split={true}
          loading={loading}
          headerTitle="积分记录"
          dataSource={integrationHistory}
        />
      </>
    )
  );
});

export default Score;
