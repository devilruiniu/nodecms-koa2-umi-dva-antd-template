// 扩展model插件
import modelExtend from 'dva-model-extend'

export const model = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
};

export const pageModel = modelExtend(model, {
  state: {
    list: [],
    pagination: {
      // 表格翻页组件的配置属性
      current: 1,
      total: 0,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  },

  reducers: {
    /**
     * 保存列表分页数据，list中存放列表数据，pagination中存放分页数据
     * @param state
     * @param payload
     * @returns {{[p: string]: *}}
     */
    saveTableList(state, { payload }) {
      const { list, pagination } = payload;
      if(pagination.pageIndex >= 0){
        pagination.pageIndex +=1;
      }
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          pageSize:pagination.pageSize,
          current:pagination.pageIndex,
          total:pagination.totalCount
        },
      }
    },
  },
});
