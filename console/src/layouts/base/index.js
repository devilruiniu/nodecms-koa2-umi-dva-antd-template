// 依赖包
import React, { Fragment } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { withI18n } from '@lingui/react';
// 页面加载进度条
import NProgress from 'nprogress';
// 动态替换页面的<header></header>中的内容
import { Helmet } from 'react-helmet';
// 自定义组件
import CommonLayout from '@/layouts/common';
import LoginLayout from '@/layouts/login';
// 导入自定义方法
import utils from '@/utils';
// 导入样式文件
import './index.less';

// 母版页布局配置文件
const layouts = [
  {
    // 通用母版页文件名称
    name: 'common',
    // 是否是默认母版页
    isDefault: true,
    // 包括哪些文件
    include: [/.*/],
    // 排除登录
    exclude: [/(\/(en|zh))*\/login/],
    // 布局
    layout: CommonLayout,
  },
  {
    // 登录母版页文件名称
    name: 'login',
    // 是否是默认母版页
    isDefault: false,
    // 仅登录
    include: [/(\/(en|zh))*\/login/],
    // 布局
    layout: LoginLayout,
  },
];

/**
 * 所有母版页基础布局文件
 */
// connect(mapStateToProps, mapDispatchToProps)(BasicLayout);
// dva中集成了loading组件
@withI18n()
@withRouter
@connect(({ loading }) => ({ loading }))
class BaseLayout extends React.Component {
  // 前一个页面的路径
  previousPath = '';

  render() {
    const { loading, location, children , i18n} = this.props;
    // 根据当前的hash查找当前需要使用哪个布局文件
    const MasterLayout = utils.Fn.getCurrentLayout(layouts, location.pathname);
    // 当前页面的路径
    const currentPath = location.pathname + location.search;
    // 不是同一个页面
    if (currentPath !== this.previousPath) {
      // 开始加载进度条
      NProgress.start();
    }
    // 实上 dva-loading 只是提供当前异步加载方法的状态（异步加载中状态为 true，异步加载完成状态为 false）
    if (!loading.global) {
      NProgress.done();
      this.previousPath = currentPath;
    }
    return (
      <Fragment>
        <Helmet>
          <title>{i18n.t`Share Sale Admin`}</title>
        </Helmet>
        <MasterLayout>{children}</MasterLayout>
      </Fragment>
    );
  }
}

export default BaseLayout;
