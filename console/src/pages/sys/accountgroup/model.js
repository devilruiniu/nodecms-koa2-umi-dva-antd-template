// 扩展model方法
import modelExtend from 'dva-model-extend';
// 通用model
import { pageModel } from '@/utils/model';
// antd组件
import { message } from 'antd';
// 发起请求的方法
import { rGetList, rPost, rPut, rDelete, rGet } from '@/restful';
// 方法
import utils from '@/utils';
// 命名空间
const namespace = 'accountgroup';
const apiData = {
  accountgroup: 'adminApi/accountgroup/list',
  accountgroupInfo: 'adminApi/accountgroup/info',
  menu: 'adminApi/menu',
};
export default modelExtend(pageModel, {
  namespace,
  state: {
    modalVisible: false,
    modalType: 'create',
    currentItem: {
      status: '1',
    },
    menuTree:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (utils.Fn.pathMatchRegexp('/sys/accountgroup', location.pathname)) {
          dispatch({
            type: 'getAccountGroupList',
            payload: { params: location.query },
          });
        }
      });
    },
  },
  effects: {
    * getAccountGroupList({ payload = {} }, { call, put }) {
      // 默认的分页参数
      const paginationData = pageModel.state.pagination;
      // 添加分页参数
      payload.params = {
        pageSize: paginationData.pageSize,
        pageIndex: paginationData.current - 1,
        ...payload.params,
      };
      // 调用账户组列表接口获取数据
      const accountListData = yield call(rGetList, apiData.accountgroup, payload);
      const { list, pageSize, pageIndex, totalCount } = accountListData;
      yield put({
        type: 'saveTableList',
        payload: {
          list,
          pagination: {
            pageSize,
            pageIndex,
            totalCount,
          },
        },
      });
    },
    * addAccountGroup({ payload = {} }, { call }) {
      const response = yield call(rPost, apiData.accountgroupInfo, payload);
      if (response) {
        message.success('添加成功');
      }
    },
    * editAccountGroup({ payload = {} }, { call, put }) {
      const response = yield call(rPut, apiData.accountgroupInfo, payload);
      if (response) {
        message.success('修改成功');
        yield put({ type: 'hideModal' });
      }
    },
    * deleteAccountGroup({ payload = {} }, { call }) {
      const response = yield call(rDelete, apiData.accountgroupInfo, payload);
      if (response) {
        message.success('删除成功');
      }
    },
    /**
     * 供设置权限页面使用，后去菜单并格式化菜单数据
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    * getMenu({ payload = {} }, { call, put }) {
      const menu = yield call(rGet, apiData.menu);
      // 组件中的key值只能保存string类型的值
      menu.forEach(item=>{
        item.id = item.id.toString();
        item.parent_id = item.parent_id.toString();
      });
      // 生成菜单树对象
      const menuTree = utils.Fn.arrayToTree(menu, 'id', 'parent_id' );
      yield put({ type: 'saveMenu',payload:menuTree });
    },
  },
  reducers: {
    saveMenu(state, { payload }) {
      return {
        ...state,
        menuTree:payload
      };
    },
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },

    hideModal(state) {
      return { ...state, modalVisible: false };
    }
  },
});
