// 依赖包
import React from 'react';
import Redirect from 'umi/redirect';
import { withI18n } from '@lingui/react';

@withI18n()
class Index extends React.Component {
  render() {
    const { i18n } = this.props;
    // 重定向到dashboard页面
    return <Redirect to={i18n.t`/dashboard`}/>;
  }
}

export default Index;
