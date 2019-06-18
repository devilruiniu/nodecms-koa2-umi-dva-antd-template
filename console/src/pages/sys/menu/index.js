// 依赖包
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { stringify } from 'qs';
// antd组件
import { Modal } from 'antd';
// 自定义组件
import Page from '@/components/content_page';
import DropOption from '@/components/drop_option';
import TableContainer from '@/components/table';
import OperateModal from './modal';
import Filter from './filter';
// 方法
import utils from '@/utils';

const { confirm } = Modal;
const namespace = 'menu';

@connect(({ menu, loading }) => ({ menu, loading }))
class Index extends React.Component {
  /**
   * 处理表格中的操作事件
   * @param record
   * @param e
   */
  handleMenuClick = (record, e) => {
    const _self = this;
    if (e.key === '1') {
      // 新建
      // 每次新建的时候要重置当前项为初始情况，因为如果先点击编辑，再新增的话会保留编辑的值
      _self.props.dispatch({
        type: `${namespace}/showModal`,
        payload: {
          modalType: 'sub_create',
          currentItem: {
            level:record.level,
            id:record.id,
            path:record.path,
            status: '1',
            is_nav_menu: '1',
          },
        },
      });
    } else if (e.key === '2') {
      // 编辑
      _self.onEditItem(record);
    } else if (e.key === '3') {
      // 启用禁用
      _self.onEnableItem(record);
    } else if (e.key === '4') {
      // 删除
      confirm({
        title: '是否删除当前菜单',
        confirmLoading: _self.props.loading.effects[`${namespace}/deleteMenu`],
        onOk: () => {
          _self.onDeleteItem(record.id);
        },
      });
    }
  };

  /**
   * 所有会影响页面数据的操作都需要重新刷新
   * @param newQuery
   */
  handleRefresh = (newQuery) => {
    const { location } = this.props;
    const { query, pathname } = location;
    utils.router.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        // api参考https://www.npmjs.com/package/qs
        { arrayFormat: 'repeat' },
      ),
    });
  };

  /**
   * 删除操作事件
   * @param id
   */
  onDeleteItem = (id) => {
    const { menu } = this.props;
    const { list, pagination } = menu;
    this.props.dispatch({
      type: `${namespace}/deleteMenu`,
      payload: { id },
    }).then(() => {
      this.handleRefresh({
        pageIndex:
          list.length === 1 && pagination.current > 1 ? pagination.current - 2 : pagination.current - 1,
      });
    });
  };

  /**
   * 启用/禁用操作
   * @param id
   */
  onEnableItem = (record) => {
    record.status = Number(record.status) === 1 ? 2 : 1;
    this.props.dispatch({
      type: `${namespace}/editMenu`,
      payload: { data: record },
    }).then(() => {
      this.handleRefresh();
    });
  };

  /**
   * 编辑操作按钮事件
   * @param item
   */
  onEditItem = (item) => {
    item.status = item.status.toString();
    item.is_nav_menu = item.is_nav_menu.toString();
    this.props.dispatch({
      type: `${namespace}/showModal`,
      payload: {
        modalType: 'update',
        currentItem: item,
      },
    });
  };

  render() {
    const { location, menu, loading, dispatch } = this.props;
    const { query } = location;
    const { list, modalVisible, modalType, currentItem } = menu;
    // 查询组件属性
    const filterProps = {
      filter: {
        ...query,
      },
      onFilterChange: (value) => {
        this.handleRefresh({
          ...value,
          pageIndex: 0,
        });
      },
      onAdd() {
        // 每次新建的时候要重置当前项为初始情况，因为如果先点击编辑，再新增的话会保留编辑的值
        dispatch({
          type: `${namespace}/showModal`,
          payload: {
            modalType: 'create',
            currentItem: {
              status: '1',
              is_nav_menu: '1',
            },
          },
        });
      },
    };
    // 表格字段对应
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 140,
        fixed: 'left',
      },
      {
        title: '导航菜单',
        dataIndex: 'is_nav_menu',
        key: 'is_nav_menu',
        render: text => Number(text) === 1 ? '是' : '否',
      },
      {
        title: '层级',
        dataIndex: 'level',
        key: 'level',
      },
      {
        title: '图标',
        dataIndex: 'icon',
        key: 'icon',
        render: text => text ? text : 'N/A',
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
      },
      {
        title: '路由',
        dataIndex: 'route',
        key: 'route',
        render: text => text ? text : 'N/A',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => Number(text) === 1 ? '启用' : '禁用',
      },
      {
        title: '修改时间',
        dataIndex: 'meta_modified',
        key: 'meta_modified',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: '新建' },
                { key: '2', name: '编辑' },
                { key: '3', name: Number(record.status) ? '禁用' : '启用' },
                { key: '4', name: '删除' },
              ]}
            />
          );
        },
      },
    ];
    // 表格组件属性
    const tableProps = {
      list,
      pagination: false,
      loading: loading.effects[`${namespace}/getMenuList`],
      columns: columns,
      /**
       * 表格翻页事件
       * @param page
       */
      onChange: (page, pageSize) => {
        this.handleRefresh({
          pageIndex: page - 1,
          pageSize,
        });
      },
      /**
       * 表格条数改变事件
       * @param current
       * @param pageSize
       */
      onShowSizeChange: (current, pageSize) => {
        this.handleRefresh({
          pageIndex: current - 1,
          pageSize,
        });
      },
    };
    // 新增/编辑弹框确定按钮触发接口事件
    const confirmDispatch = modalType === 'create' || modalType === 'sub_create' ? `${namespace}/addMenu` : `${namespace}/editMenu`;
    // 新增/编辑弹框配置属性
    const modalProps = {
      item: currentItem,
      modalType,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[confirmDispatch],
      title: `${modalType === 'create' || modalType === 'sub_create' ? '创建菜单' : '编辑菜单'}`,
      centered: true,
      onOk: (data) => {
        dispatch({
          type: confirmDispatch,
          payload: { data },
        }).then(() => {
          this.handleRefresh();
        });
      },
      onCancel: () => {
        dispatch({
          type: `${namespace}/hideModal`,
        });
      },
    };
    return <Page inner>
      <Filter {...filterProps} />
      <TableContainer {...tableProps} />
      {modalVisible && <OperateModal {...modalProps} />}
    </Page>;
  }
}

export default Index;
