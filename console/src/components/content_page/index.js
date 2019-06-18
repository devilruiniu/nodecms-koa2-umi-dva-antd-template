// 依赖包
import React, {Fragment} from 'react';
import classnames from 'classnames';
// 自定义组件
import Loader from '@/components/loader';
// 样式文件
import styles from './index.less'
class Index extends React.Component{
  render(){
    const { className, children, loading = false, inner = false } = this.props;
    const loadingStyle = {
      height: 'calc(100vh - 204px)',
      overflow: 'hidden',
    };
    return <Fragment>
      <div
        className={classnames(className, {
          [styles.contentInner]: inner,
        })}
        style={loading ? loadingStyle : null}
      >
        {loading ? <Loader spinning /> : ''}
        {children}
      </div>
    </Fragment>
  }
}

export default Index;
