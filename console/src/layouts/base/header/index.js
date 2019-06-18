// 依赖包
import React, { Fragment } from 'react';
import { withI18n, Trans } from '@lingui/react';
import classnames from 'classnames';
import moment from 'moment';
// antd组件
import { Menu, Icon, Layout, Avatar, Popover, Badge, List } from 'antd';
import { Ellipsis } from 'ant-design-pro';
// 配置文件
import config from '@/config';
// 方法
import utils from '@/utils';
// 样式文件
import styles from './index.less';

const { SubMenu } = Menu;

/**
 * Header
 */
@withI18n()
class Index extends React.Component {
  handleClickMenu = e => {
    e.key === 'SignOut' && this.props.onSignOut()
  };
  render() {
    const {
      i18n,
      fixed,
      collapsed,
      username,
      onCollapseChange,
    } = this.props;
    const rightContent = [<Menu key="user" mode="horizontal" onClick={this.handleClickMenu}>
      <SubMenu
        title={
          <Fragment>
              <span style={{ color: '#999', marginRight: 4 }}>
                <Trans>Hi,</Trans>
              </span>
            <span>{username}</span>
            <Avatar style={{ marginLeft: 8 }} src="/user_header.png"/>
          </Fragment>
        }
      >
        <Menu.Item key="SignOut">
          <Trans>Sign out</Trans>
        </Menu.Item>
      </SubMenu>
    </Menu>];
    if (config.i18n) {
      const { languages } = config.i18n;
      const currentLanguage = languages.find(item => item.key === i18n._language);

      rightContent.unshift(
        <Menu
          key="language"
          selectedKeys={[currentLanguage.key]}
          onClick={data => {
            utils.Fn.setLocale(data.key)
          }}
          mode="horizontal"
        >
          <SubMenu title={<Avatar size="small" src={currentLanguage.flag} />}>
            {languages.map(item => (
              <Menu.Item key={item.key}>
                <Avatar
                  size="small"
                  style={{ marginRight: 8 }}
                  src={item.flag}
                />
                {item.title}
              </Menu.Item>
            ))}
          </SubMenu>
        </Menu>
      )
    }
    // 后期从接口中获取
    const notifications= [
        {
          title: 'New User is registered.',
          date: new Date(Date.now() - 10000000),
        },
        {
          title: 'Application has been approved.',
          date: new Date(Date.now() - 50000000),
        },
        ];
    rightContent.unshift(
      <Popover
        placement="bottomRight"
        trigger="click"
        key="notifications"
        overlayClassName={styles.notificationPopover}
        getPopupContainer={() => document.querySelector('#layoutHeader')}
        content={
          <div className={styles.notification}>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              locale={{
                emptyText: <Trans>You have viewed all notifications.</Trans>,
              }}
              renderItem={item => (
                <List.Item className={styles.notificationItem}>
                  <List.Item.Meta
                    title={
                      <Ellipsis tooltip lines={1}>
                        {item.title}
                      </Ellipsis>
                    }
                    description={moment(item.date).fromNow()}
                  />
                  <Icon
                    style={{ fontSize: 10, color: '#ccc' }}
                    type="right"
                    theme="outlined"
                  />
                </List.Item>
              )}
            />
            {notifications.length ? (
              <div
                // onClick={onAllNotificationsRead}
                className={styles.clearButton}
              >
                <Trans>Clear notifications</Trans>
              </div>
            ) : null}
          </div>
        }
      >
        <Badge
          count={notifications.length}
          dot
          offset={[-10, 10]}
          className={styles.iconButton}
        >
          <Icon className={styles.iconFont} type="bell" />
        </Badge>
      </Popover>
    );
    return <Layout.Header
      className={classnames(styles.header, {
        [styles.fixed]: fixed,
        [styles.collapsed]: collapsed,
      })}
      id="layoutHeader"
    >
      <div
        className={styles.button}
        onClick={onCollapseChange.bind(this, !collapsed)}
      >
        <Icon
          type={classnames({
            'menu-unfold': collapsed,
            'menu-fold': !collapsed,
          })}
        />
      </div>
      <div className={styles.rightContainer}>{rightContent}</div>
    </Layout.Header>;
  }
}

export default Index;
