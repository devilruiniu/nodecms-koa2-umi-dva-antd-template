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
const namespace = 'accountgroup';

@connect(({ accountgroup, loading }) => ({ accountgroup, loading }))
class Index extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type:`${namespace}/getMenu`
    })
  }

  /**
   * 处理表格中的操作事件
   * @param record
   * @param e
   */
  handleMenuClick = (record, e) => {
    const _self = this;
    if (e.key === '1') {
      // 编辑
      _self.onEditItem(record);
    } else if (e.key === '2') {
      // 启用禁用
      _self.onEnableItem(record);
    } else if (e.key === '3') {
      // 删除
      confirm({
        title: '是否删除当前账户组',
        confirmLoading:_self.props.loading.effects[`${namespace}/deleteAccount`],
        onOk:()=> {
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
    const { accountgroup } = this.props;
    const { list, pagination } = accountgroup;
    this.props.dispatch({
      type: `${namespace}/deleteAccountGroup`,
      payload: {id},
    }).then(() => {
      this.handleRefresh({
        pageIndex:
          list.length === 1 && pagination.current > 1 ? pagination.current - 2 : pagination.current - 1,
      });
    });
  };

  /**
   * 启用/禁用操作
   * @param record
   */
  onEnableItem = (record) => {
    record.status = Number(record.status) === 1 ? 2 : 1;
    this.props.dispatch({
      type: `${namespace}/editAccountGroup`,
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
    this.props.dispatch({
      type: `${namespace}/showModal`,
      payload: {
        modalType: 'update',
        currentItem: item,
      },
    });
  };


  render() {
    const { location, accountgroup, loading, dispatch } = this.props;
    const { query } = location;
    const { list, pagination, modalVisible, modalType, currentItem,menuTree } = accountgroup;
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
            },
          },
        });
      },
    };
    // 表格字段对应
    const columns = [
      {
        title: '账号组',
        dataIndex: 'name',
        key: 'name',
        width: 140,
        fixed: 'left',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => Number(text) === 1 ? '启用' : '禁用',
      },
      {
        title: '创建日期',
        dataIndex: 'meta_created',
        key: 'meta_created',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          let options = [{ key: '1', name: '编辑' }];
          if(Number(record.id) !== 1){
            // 超级管理员没有启用和禁用以及删除功能
            options.push( { key: '2', name: Number(record.status) === 1 ? '禁用' : '启用' });
            options.push( { key: '3', name: '删除' });
          }
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={options}
            />
          );
        },
      },
    ];
    // 表格组件属性
    const tableProps = {
      list,
      pagination,
      loading: loading.effects[`${namespace}/getAccountGroupList`],
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
    const confirmDispatch = modalType === 'create' ? `${namespace}/addAccountGroup` : `${namespace}/editAccountGroup`;
    // 新增/编辑弹框配置属性
    const modalProps = {
      item: currentItem,
      visible: modalVisible,
      modalType,
      menuTree,
      maskClosable: false,
      menuLoading:loading.effects[`${namespace}/getMenu`],
      confirmLoading: loading.effects[confirmDispatch],
      title: `${modalType === 'create' ? '创建账户组' : '编辑账户组'}`,
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
