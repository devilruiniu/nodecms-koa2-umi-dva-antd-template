// 依赖包
import React from 'react';
import { withI18n, Trans } from '@lingui/react';
// antd组件
import { Icon, Switch, Layout } from 'antd';
// 其他组件
import ScrollBar from '@/components/scrollbar';
// 自定义组件
import SiderMenu from '@/layouts/base/sider_menu'
// 配置文件
import config from '@/config';
// 常量
import constants from '@/constants';
// 样式文件
import styles from './index.less';
/**
 * Slider
 */
@withI18n()
class Index extends React.Component {
  render() {
    const {
      i18n,
      theme,
      collapsed,
      isMobile,
      menus,
      onThemeChange,
      onCollapseChange
    } = this.props;
    return <Layout.Sider
      width={constants.menuWidth}
      theme={theme}
      breakpoint="lg"
      trigger={null}
      collapsible
      collapsed={collapsed}
      onBreakpoint={isMobile ? null : onCollapseChange}
      className={styles.sider}
    >
      <div className={styles.brand}>
        <div className={styles.logo}>
          <img alt="logo" src={config.project.logoPath} />
          {collapsed ? null : <h1>{i18n.t`Share Sale Admin`}</h1>}
        </div>
      </div>
      <div className={styles.menuContainer}>
        <ScrollBar
          option={{
            // Disabled horizontal scrolling, https://github.com/utatti/perfect-scrollbar#options
            suppressScrollX: true,
          }}
        >
          <SiderMenu
            menus={menus}
            theme={theme}
            isMobile={isMobile}
            collapsed={collapsed}
            onCollapseChange={onCollapseChange}
          />
        </ScrollBar>
      </div>
      {collapsed ? null : (
        <div className={styles.switchTheme}>
            <span>
              <Icon type="bulb" />
              <Trans>Switch Theme</Trans>
            </span>
          <Switch
            onChange={onThemeChange.bind(
              this,
              theme === constants.menuThemeList.filter(item=>item.isDefault)[0].name ? constants.menuThemeList[1].name : constants.menuThemeList[0].name
            )}
            defaultChecked={theme === constants.menuThemeList[1].name}
            checkedChildren={i18n.t`Dark`}
            unCheckedChildren={i18n.t`Light`}
          />
        </div>
      )}
    </Layout.Sider>;
  }
}

export default Index;
