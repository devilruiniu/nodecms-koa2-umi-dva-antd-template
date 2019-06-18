// 依赖包
import React from 'react';

// 样式文件
import styles from './index.less';

class Index extends React.Component {
  render() {
    const { label = '', children } = this.props;
    const labelArray = label.split('');
    return <div className={styles.filterItem}>
      {labelArray.length > 0 ? (
        <div className={styles.labelWrap}>
          {labelArray.map((item, index) => (
            <span className="labelText" key={index}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        ''
      )}
      <div className={styles.item}>{children}</div>
    </div>;
  }
}

export default Index;
