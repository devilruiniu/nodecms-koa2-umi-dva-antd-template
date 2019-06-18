// 扩展model方法
import modelExtend from 'dva-model-extend';
// 通用model
import { pageModel } from '@/utils/model';
// antd组件
import { message } from 'antd';
// 发起请求的方法
import { rGetList, rPost, rPut, rDelete } from '@/restful';
// 方法
import utils from '@/utils';
// 命名空间
const namespace = 'account';
const apiData = {
  account: 'adminApi/account/list',
  accountInfo: 'adminApi/account/info',
  accountgroup:'adminApi/accountgroup/list'
};
export default modelExtend(pageModel, {
  namespace,
  state: {
    modalVisible: false,
    modalType: 'create',
    currentItem: {
      status: '1',
    },
    accountGroupList:[],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (utils.Fn.pathMatchRegexp('/sys/account', location.pathname)) {
          dispatch({
            type: 'getAccountList',
            payload: { params: location.query },
          });
        }
      });
    },
  },
  effects: {
    * getAccountList({ payload = {} }, { call, put }) {
      // 默认的分页参数
      const paginationData = pageModel.state.pagination;
      // 添加分页参数
      payload.params = {
        pageSize: paginationData.pageSize,
        pageIndex: paginationData.current-1,
        ...payload.params,
      };
      // 调用账户列表接口获取数据
      const accountListData = yield call(rGetList, apiData.account, payload);
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
    * getAccountGroupList({ payload = {} }, { call, put }) {
      // 添加分页参数
      payload.params = {
        pageSize: 9999,
        pageIndex: 0,
      };
      // 调用账户列表接口获取数据
      const accountGroupListData = yield call(rGetList, apiData.accountgroup, payload);
      const { list } = accountGroupListData;
      yield put({
        type: 'saveAccountGroup',
        payload: {
          list
        },
      });
    },
    * addAccount({ payload = {} }, { call }) {
      const response = yield call(rPost, apiData.accountInfo, payload);
      if (response) {
        message.success('添加成功');
      }
    },
    * editAccount({ payload = {} }, { call, put }) {
      const response = yield call(rPut, apiData.accountInfo, payload);
      if (response) {
        message.success('修改成功');
        yield put({ type: 'hideModal' });
      }
    },
    * deleteAccount({ payload = {} }, { call }) {
      const response = yield call(rDelete, apiData.accountInfo, payload);
      if (response) {
        message.success('删除成功');
      }
    },
  },
  reducers: {
    saveAccountGroup(state, { payload }) {
      payload.list.forEach(item=>{
        item.id = item.id.toString()
      });
      return {
        ...state,
        accountGroupList:payload.list
      };
    },
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },

    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
});
