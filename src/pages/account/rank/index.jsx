import React, { memo, useState, useEffect, useMemo } from 'react';
import ProCard from '@ant-design/pro-card';
import { Card, message, Modal, DatePicker, Button } from 'antd';
import { SearchOutlined, SmileOutlined } from '@ant-design/icons';
import moment from 'moment';
import dayjs from 'dayjs';
import {
  getTotalIntegrationRank,
  getMyRank,
  getMonthRank,
  getWeekRank,
} from '@/services/ant-design-pro/user';
import style from './index.less';

const Rank = memo(() => {
  const [totalListLoading, setTotalListLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [myRankLoading, setMyRankLoading] = useState(false);
  const [totalRank, setTotalRank] = useState(null);
  const [weekRank, setWeekRank] = useState(null);
  const [monthRank, setMonthRank] = useState(null);

  // const nowTime = dayjs();

  useEffect(() => {
    getTotal();
    handleGetWeekRank();
    handleGetMonthRank();
  }, []);

  const getTotal = async () => {
    let res = await getTotalIntegrationRank();
    if (res?.code) {
      setTotalRank(res.data);
    } else {
      message.error(res.msg);
    }
  };

  const handleGetMyRank = async () => {
    setMyRankLoading(true);
    let res = await getMyRank(localStorage.getItem('uuid'));
    setMyRankLoading(false);
    if (!res.code) {
      message.error(res.msg);
      return;
    }
    Modal.confirm({
      icon: <SmileOutlined />,
      content: `您的积分排名为${res.rank},请继续卷！`,
      okText: '知道了',
    });
  };

  const handleGetWeekRank = async (date = moment()) => {
    const weekOfday = moment(date).format('E'); //计算今天是这周第几天
    const last_monday = moment(date)
      .subtract(weekOfday - 1, 'days')
      .format('YYYY-MM-DD'); //周一日期
    const last_sunday = moment(date)
      .add(7 - weekOfday, 'days')
      .format('YYYY-MM-DD'); //周日日期

    let res = await getWeekRank(last_monday, last_sunday);
    if (!res.code) {
      setWeekRank((_) => null);
      message.error(res.msg);
      return;
    }
    setWeekRank((_) => res.data);
  };

  const handleGetMonthRank = async (date = moment().format('YYYY-MM')) => {
    const res = await getMonthRank(date);
    if (!res.code) {
      setMonthRank((_) => null);
      message.error(res.msg);
      return;
    }
    setMonthRank((_) => res.data);
  };

  const handleChooseWeek = (weekData, dateString) => {
    handleGetWeekRank(weekData._d);
  };

  const handleChooseMonth = (monthData, dateString) => {
    handleGetMonthRank(dateString);
  };

  return (
    <>
      <ProCard style={{ marginTop: 8, padding: 0 }} gutter={[20, 20]} wrap title="积分排行">
        <ProCard colSpan={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8 }} layout="center" bordered>
          <Card
            title="总积分榜"
            extra={
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleGetMyRank}
                loading={myRankLoading}
              >
                我的排名
              </Button>
            }
            bordered={false}
            style={{ width: '100%' }}
          >
            {totalRank &&
              totalRank.map((item, index) => {
                return (
                  <div key={item.id} className={style.totalRank}>
                    <div className={style.userinfo}>
                      <img className={style.avatar} src={item.avatar} alt="" />
                      <div>
                        <div>
                          <span>{item?.name}</span>
                          <span style={{ marginLeft: 10 }}>{item?.class}</span>
                        </div>
                        <div>积分: {item.integration}</div>
                      </div>
                    </div>

                    <div>Top {index + 1}</div>
                  </div>
                );
              })}
          </Card>
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8 }} layout="center" bordered>
          <Card
            title="积分周榜"
            extra={
              <DatePicker
                allowClear={false}
                onChange={handleChooseWeek}
                defaultValue={moment()}
                picker="week"
              />
            }
            bordered={false}
            style={{ width: '100%' }}
          >
            {weekRank &&
              weekRank.map((item, index) => (
                <div key={item.id} className={style.totalRank}>
                  <div className={style.userinfo}>
                    <img className={style.avatar} src={item.avatar} alt="" />
                    <div>
                      <div>
                        <span>{item?.name}</span>
                        <span style={{ marginLeft: 10 }}>{item?.class}</span>
                      </div>
                      <div>积分: {item.value}</div>
                    </div>
                  </div>
                  <div>Top {index + 1}</div>
                </div>
              ))}
          </Card>
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8 }} layout="center" bordered>
          <Card
            title="积分月榜"
            extra={
              <DatePicker
                onChange={handleChooseMonth}
                defaultValue={moment()}
                allowClear={false}
                picker="month"
                format="YYYY-MM"
              />
            }
            bordered={false}
            style={{ width: '100%' }}
          >
            {monthRank &&
              monthRank.map((item, index) => (
                <div key={item.id} className={style.totalRank}>
                  <div className={style.userinfo}>
                    <img className={style.avatar} src={item.avatar} alt="" />
                    <div>
                      <div>
                        <span>{item?.name}</span>
                        <span style={{ marginLeft: 10 }}>{item?.class}</span>
                      </div>
                      <div>积分: {item.value}</div>
                    </div>
                  </div>
                  <div>Top {index + 1}</div>
                </div>
              ))}
          </Card>
        </ProCard>
      </ProCard>
    </>
  );
});

export default Rank;
