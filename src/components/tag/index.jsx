import React, { memo } from 'react';
import style from './index.less';

export default memo(function Tag(props) {
  const { title, onTagClick, id, currentTag } = props;

  return (
    <div
      onClick={onTagClick}
      className={[style.box, currentTag === id ? style.active : ''].join(' ')}
    >
      {title}
    </div>
  );
});
