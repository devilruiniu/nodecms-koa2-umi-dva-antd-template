// 依赖包
import React from 'react';
import { connect } from 'dva';
import { withI18n } from '@lingui/react';
// 自定义组件
import Page from '@/components/content_page';
// 样式文件
import styles from './index.less';

// 把对应model-namespace中的state值传入到当前组件的props中,名称一定要一样，且不能使用变量
@withI18n()
@connect(({ global, dashboard, loading }) => ({
  global,
  dashboard,
  loading,
}))
class Index extends React.Component {
  render() {
    const { i18n } = this.props;
    return <Page inner>
      <div className={styles.homePage}>
        {i18n.t`Welcome to Share Sale System`}
      </div>
    </Page>;
  }
}

export default Index;
