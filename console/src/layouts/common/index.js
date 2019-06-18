// 依赖包
import React, { Fragment } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import store from 'store';
// antd组件
import { BackTop, Layout, Drawer } from 'antd';
import { GlobalFooter } from 'ant-design-pro';
// 自定义组件
import Sider from '@/layouts/base/sider';
import Header from '@/layouts/base/header';
import Bread from '@/layouts/base/bread';
// 配置文件
import config from '@/config';
// 常量
import constants from '@/constants';
// 静态资源文件
import styles from '../index.less';

const { Content } = Layout;
const globalObject = constants.models.global;
/**
 * 通用母版页
 */
@withRouter
@connect(({ global, loading }) => ({ global, loading }))
class CommonMaster extends React.Component {
  state = {
    isMobile: false,
  };

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  // 绑定收缩，展开事件
  onCollapseChange = (collapsed) => {
    this.props.dispatch({
      type: `${globalObject.namespace}/${globalObject.reducers.handleCollapseChange}`,
      payload: collapsed,
    });
  };

  render() {
    const { global, dispatch, children } = this.props;
    const { isMobile } = this.state;
    const { onCollapseChange } = this;
    const { collapsed, menuTheme } = global;
    const menus = store.get(constants.store.menu);
    const headerProps = {
      menus,
      collapsed,
      onCollapseChange,
      username:store.get(constants.store.userName),
      fixed: config.fixedHeader,
      onSignOut() {
        dispatch({ type: `${globalObject.namespace}/${globalObject.effects.signOut}` })
      },
    };
    // 需要传递给子元素的属性
    const sliderProps = {
      theme: menuTheme,
      collapsed,
      isMobile,
      menus,
      onCollapseChange,
      onThemeChange(theme) {
        dispatch({
          type: `${globalObject.namespace}/${globalObject.reducers.handleMenuThemeChange}`,
          payload: theme,
        });
      },
    };
    return (
      <Fragment>
        <Layout>
          {isMobile ?
            <Drawer
              maskClosable
              closable={false}
              onClose={this.onCollapseChange(!collapsed)}
              visible={!collapsed}
              placement="left"
              width={200}
              style={{
                padding: 0,
                height: '100vh',
              }}
            >
              <Sider {...sliderProps} />
            </Drawer> : <Sider {...sliderProps} />
          }
          <div
            className={styles.container}
            style={{ paddingTop: config.fixedHeader ? 72 : 0 }}
            id="primaryLayout"
          >
            <Header {...headerProps} />
            <Content className={styles.content}>
              <Bread routeList={menus} />
              {children}
            </Content>
            <BackTop
              className={styles.backTop}
              target={() => document.querySelector('#primaryLayout')}
            />
            <GlobalFooter
              className={styles.footer}
              copyright={config.project.copyright}
            />
          </div>
        </Layout>
      </Fragment>
    );
  }
}

export default CommonMaster;
