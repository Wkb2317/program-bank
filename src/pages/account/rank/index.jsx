import React, { memo, useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Card, message } from 'antd';
import dayjs from 'dayjs';
import { getTotalIntegrationRank } from '@/services/ant-design-pro/user';

const Rank = memo(() => {
  const [totalListLoading, setTotalListLoading] = useState(true);
  const [totalRank, setTotalRank] = useState(null);
  const [weekRank, setWeekRank] = useState(null);
  const [monthRank, setMonthRank] = useState(null);

  const nowTime = dayjs();

  useEffect(() => {
    getTotal();
  }, []);

  const getTotal = async () => {
    let res = await getTotalIntegrationRank();
    if (res?.code) {
      setTotalRank(res.data);
    } else {
      message.error(res.msg);
    }
  };

  return (
    <>
      <ProCard style={{ marginTop: 8, padding: 0 }} gutter={[20, 20]} wrap title="积分排行">
        <ProCard colSpan={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8 }} layout="center" bordered>
          <Card
            title="总积分榜"
            extra={<a href="#">More</a>}
            bordered={false}
            style={{ width: '100%' }}
          >
            {}
          </Card>
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8 }} layout="center" bordered>
          <Card
            title="积分周榜"
            extra={<a href="#">More</a>}
            bordered={false}
            style={{ width: '100%' }}
          >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8 }} layout="center" bordered>
          <Card
            title="积分月榜"
            extra={<a href="#">More</a>}
            bordered={false}
            style={{ width: '100%' }}
          >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </ProCard>
      </ProCard>
    </>
  );
});

export default Rank;
