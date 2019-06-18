// 扩展model方法
import modelExtend from 'dva-model-extend';
// 通用model
import { model } from '@/utils/model';

export default modelExtend(model, {
  namespace:"dashboard",
  state: {
    test:1
  },
  subscriptions: {
    setup({ dispatch, history }) {

    },
  },
  effects: {

  }
});
