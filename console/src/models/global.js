// 依赖包
import { stringify } from 'qs';
import store from 'store';
// 常量
import constants from '@/constants';
// 方法
import utils from '@/utils';
import { rGet } from '@/restful';
// 路由
const router = utils.router;
const globalObj = constants.models.global;

let apiData = {
  loginOut: 'adminApi/loginOut',
};
// 全局的model,"global/query"
export default {
  namespace: globalObj.namespace,
  state: {
    // 菜单是否折叠
    collapsed:store.get(constants.store.collapsed) || false,
    // 菜单主题
    menuTheme: store.get(constants.store.menuTheme) || constants.menuThemeList.filter(item=>item.isDefault)[0].name,
  },
  /**
   * 可以监听路由变化，鼠标，键盘变化，服务器连接变化，状态变化等，
   * 这样在其中就可以根据不同的变化做出相应的处理，在这个 subsriptions 中的方法名是随意定的，
   * 每次变化都会一次去调用里面的所有方法，所以一般会加相应的判断。
   * 简而言之：就是每次加载都会执行一遍这里面的方法
   */
  subscriptions: {
    setup({ dispatch }) {
      // 第一次载入的时候执行
      dispatch({ type: globalObj.effects.hasToken });
    },
  },
  effects: {
    * [globalObj.effects.hasToken]() {
      const token = yield store.get(constants.store.token);
      const loginPathname = '/login';
      // 如果是登录页面，则不需要验证token
      if (utils.Fn.deleteLangPrefix(utils.Fn.hashToObj().pathname) !== loginPathname) {
        // 如果token不存在，跳转到登录页面
        if (!token) {
          router.push({
            pathname: loginPathname,
            search: stringify({
              from: '/dashboard',
            }),
          });
        }
      }
    },
    *[globalObj.effects.signOut]({ payload }, { call, put }) {
      // 注销登录事件
      yield call(rGet, apiData.loginOut, payload);
      store.clearAll();
      router.push({
        pathname:"/login"
      })
    },
  },
  reducers: {
    /**
     * 全局更新状态
     * @param state
     * @param payload
     */
    [globalObj.reducers.updateState](state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    /**
     * 处理菜单收起，展开状态变更事件
     * @param state
     * @param payload
     */
    [globalObj.reducers.handleCollapseChange](state, { payload }) {
      store.set(constants.store.collapsed, payload);
      return {
        ...state,
        collapsed:payload,
      };
    },
    /**
     * 处理菜单准提更改事件
     * @param state
     * @param payload
     */
    [globalObj.reducers.handleMenuThemeChange](state, { payload }) {
      store.set(constants.store.menuTheme, payload);
      return {
        ...state,
        menuTheme:payload,
      };
    },
  },
};
