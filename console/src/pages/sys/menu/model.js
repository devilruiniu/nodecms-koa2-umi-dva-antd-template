// 扩展model方法
import modelExtend from 'dva-model-extend';
// 通用model
import { pageModel } from '@/utils/model';
// antd组件
import { message } from 'antd';
// 发起请求的方法
import { rDelete, rGetList, rPost, rPut } from '@/restful';
import utils from '@/utils';
// 命名空间
const namespace = 'menu';
const apiData = {
  menu: 'adminApi/menu/list',
  menuInfo: 'adminApi/menu/info',
};
export default modelExtend(pageModel, {
  namespace,
  state: {
    modalVisible: false,
    modalType: 'create',
    currentItem: {
      status: '1',
      is_nav_menu:'1'
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (utils.Fn.pathMatchRegexp('/sys/menu', location.pathname)) {
          dispatch({
            type: 'getMenuList',
            payload: { params: location.query },
          });
        }
      });
    },
  },
  effects: {
    * getMenuList({ payload = {} }, { call, put }) {
      // 默认的分页参数
      const paginationData = pageModel.state.pagination;
      // 添加分页参数
      payload.params = {
        pageSize: paginationData.pageSize,
        pageIndex: paginationData.current-1,
        ...payload.params,
      };
      // 调用登录接口获取数据
      const menuListData = yield call(rGetList, apiData.menu, payload);
      const { list, pageSize, pageIndex, totalCount } = menuListData;
      // 生成菜单树对象
      const menuTree = utils.Fn.arrayToTree(list, 'id', 'parent_id' );
      yield put({
        type: 'saveTableList',
        payload: {
          list:menuTree,
          pagination: {
            pageSize,
            pageIndex,
            totalCount,
          },
        },
      });
    },
    * addMenu({ payload = {} }, { call }) {
      const response = yield call(rPost, apiData.menuInfo, payload);
      if (response) {
        message.success('添加成功');
      }
    },
    * editMenu({ payload = {} }, { call, put }) {
      const response = yield call(rPut, apiData.menuInfo, payload);
      if (response) {
        message.success('修改成功');
        yield put({ type: 'hideModal' });
      }
    },
    * deleteMenu({ payload = {} }, { call }) {
      const response = yield call(rDelete, apiData.menuInfo, payload);
      if (response) {
        message.success('删除成功');
      }
    },
  },
  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },

    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
});
