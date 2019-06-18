// 依赖包
import React, { Fragment } from 'react';
import Link from 'umi/navlink';
import withRouter from 'umi/withRouter';
import { withI18n } from '@lingui/react';
// antd组件
import { Breadcrumb, Icon } from 'antd';
// 方法
import utils from '@/utils';
// 样式文件
import styles from './index.less';

@withI18n()
@withRouter
class Index extends React.Component {
  generateBreadcrumbs = paths => {
    return paths.map((item, key) => {
      const content = (
        <Fragment>
          {item.icon ? (
            <Icon type={item.icon} style={{ marginRight: 4 }}/>
          ) : null}
          {item.name}
        </Fragment>
      );

      return (
        <Breadcrumb.Item key={key}>
          {paths.length - 1 !== key && item.route ? (
            <Link to={utils.Fn.addLangPrefix(item.route) || '#'}>{content}</Link>
          ) : (
            content
          )}
        </Breadcrumb.Item>
      );
    });
  };

  render() {
    const { routeList, location, i18n } = this.props;

    const currentRoute = routeList.find(item => item.route && utils.Fn.pathMatchRegexp(item.route, location.pathname));
    const paths = currentRoute
      ? utils.Fn.getTreeAncestors(routeList, currentRoute, 'parent_id').reverse()
      : [{}];
    paths.unshift({
      id: 0,
      name: i18n.t`Home`,
      route: `/dashboard`,
      icon: 'home',
    });
    return (
      <Breadcrumb className={styles.bread}>
        {this.generateBreadcrumbs(paths)}
      </Breadcrumb>
    );
  }
}

export default Index;
