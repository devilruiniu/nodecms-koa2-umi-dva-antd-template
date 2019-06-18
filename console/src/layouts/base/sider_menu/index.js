// 依赖包
import React, { Fragment } from 'react';
import withRouter from 'umi/withRouter';
import store from 'store';
// antd组件
import { Menu, Icon } from 'antd'
// 会在匹配上当前的url的时候给已经渲染的元素添加参数
import Navlink from 'umi/navlink';
// 常量
import constants from '@/constants';
// 方法
import utils from '@/utils';

const { SubMenu } = Menu;

/**
 * 侧边栏菜单
 */
@withRouter
class SiderMenu extends React.Component {
  state = {
    openKeys: store.get(constants.store.openKeys) || [],
  };

  /**
   * 菜单打开事件
   * @param openKeys
   */
  onOpenChange = openKeys => {
    const { menus } = this.props;
    const rootSubmenuKeys = menus.filter(item => !item.parent_id).map(item => item.id.toString());
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    let newOpenKeys = openKeys;
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : []
    }

    this.setState({
      openKeys: newOpenKeys,
    });
    store.set(constants.store.openKeys, newOpenKeys);
  };

  /**
   * 生成菜单React元素
   * @param data
   * @returns {Uint8Array | BigInt64Array | any[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
   */
  generateMenus = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <SubMenu
            key={item.id}
            title={
              <Fragment>
                {item.icon && <Icon type={item.icon}/>}
                <span>{item.name}</span>
              </Fragment>
            }
          >
            {this.generateMenus(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.id}>
          <Navlink to={utils.Fn.addLangPrefix(item.route) || '#'}>
            {item.icon && <Icon type={item.icon}/>}
            <span>{item.name}</span>
          </Navlink>
        </Menu.Item>
      );
    });
  };

  render() {
    const {
      collapsed,
      theme,
      menus,
      location,
      isMobile,
      onCollapseChange,
    } = this.props;
    // 生成菜单树对象
    const menuTree = utils.Fn.arrayToTree(menus, 'id', 'parent_id', 'children',"menu");
    // 获得当前菜单
    const currentMenu = menus.find(item => item.route && item.route && utils.Fn.pathMatchRegexp(item.route, location.pathname));
    // 菜单默认选中的key值
    const selectedKeys = currentMenu
      ? utils.Fn.getTreeAncestors(menus, currentMenu, 'parent_id').map(item => item.id.toString())
      : [];
    // 菜单属性
    const menuProps = !collapsed && selectedKeys.length>0
      ? {
        openKeys: this.state.openKeys,
      }
      : {};
    return <Menu
      mode="inline"
      theme={theme}
      onOpenChange={this.onOpenChange}
      selectedKeys={selectedKeys}
      onClick={
        isMobile
          ? () => {
            onCollapseChange(true);
          }
          : undefined
      }
      {...menuProps}
    >
      {this.generateMenus(menuTree)}
    </Menu>;
  }
}

export default SiderMenu;
