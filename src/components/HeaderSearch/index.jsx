import React, { useRef, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import { getLikeQuestion } from '@/services/ant-design-pro/question';
import styles from './index.less';
import _ from 'lodash';
import { history } from 'umi';

const HeaderSearch = (props) => {
  const inputRef = useRef(null);
  const [options, setOptions] = useState([]);

  const onInput = _.debounce(async (e) => {
    const res = await getLikeQuestion(e.target.value);
    if (res.code) {
      let optionData = res.data.map((item) => {
        return {
          lable: item.id,
          value: item.title,
        };
      });
      setOptions(optionData);
    }
  }, 100);

  const onSelect = (value, option) => {
    console.log(option);
    history.push(`/question/detail/${option.lable}`);
  };

  return (
    <div>
      <AutoComplete options={options} onSelect={(value, option) => onSelect(value, option)}>
        <Input
          size="small"
          ref={inputRef}
          aria-label="题目搜索"
          placeholder="题目搜索"
          onInput={(e) => onInput(e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
            }
          }}
          onBlur={() => {}}
        />
      </AutoComplete>
    </div>
  );
};

export default HeaderSearch;
