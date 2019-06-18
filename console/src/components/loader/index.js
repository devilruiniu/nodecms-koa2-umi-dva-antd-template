// 依赖包
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// 样式文件
import styles from './index.less';

// Loader组件
class Loader extends React.Component {
  render() {
    const { spinning = true, fullScreen } = this.props;
    return (
      <div
        className={classNames(styles.loader, {
          [styles.hidden]: !spinning,
          [styles.fullScreen]: fullScreen,
        })}
      >
        <div className={styles.warpper}>
          <div className={styles.inner}/>
          <div className={styles.text}>LOADING</div>
        </div>
      </div>
    );
  }
}

Loader.propTypes = {
  spinning: PropTypes.bool,
  fullScreen: PropTypes.bool,
};

export default Loader;
