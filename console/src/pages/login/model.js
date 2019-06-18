// 依赖包
import store from 'store';
// 扩展model方法
import modelExtend from 'dva-model-extend';
// 发起请求的方法
import { rPost, rGet } from '@/restful';
// 通用model
import { model } from '@/utils/model';
// 常量
import constants from '@/constants';
// 方法
import utils from '@/utils';

let apiData = {
  login: 'adminApi/login',
  menu: 'adminApi/menu/account_group',
};

export default modelExtend(model, {
  namespace: 'login',
  state: {},
  subscriptions: {
    setup() {
      store.clearAll();
    },
  },
  effects: {
    * login({ payload, location }, { call, put }) {
      // 调用登录接口获取数据
      const loginData = yield call(rPost, apiData.login, payload);
      // 状态码为10000时，才会到这里，否则会提示错误下次，在request的时候做了校验
      // 登录成功，保存TOKEN
      store.set(constants.store.token, loginData.token);
      // 保存用户名
      store.set(constants.store.userName, loginData.name);
      // 获取账户组id
      const account_group_id = loginData.account_group_id;
      // 获取根据账户组id,获取菜单数据
      const menu = yield call(rGet, apiData.menu,{id:account_group_id});
      // 保存菜单
      store.set(constants.store.menu, menu);
      // 如果没有来源页面，默认跳转到首页
      const fromPage = location.query.from||"/";
      // 跳转到来源页面
      utils.router.push({
        pathname:fromPage
      });
    },
  },
});
