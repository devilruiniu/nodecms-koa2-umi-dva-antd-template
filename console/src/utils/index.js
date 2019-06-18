// 路由
import umiRouter from 'umi/router'
// 依赖包
import { flow, isString } from 'lodash';
// 一般方法
import Fn from '@/utils/fn'
// 校验方法
import Validate from '@/utils/validate';
// 加密方法
import Crypto from '@/utils/crypto';

// 重写router对象的push方法和replace方法
const myRouter = { ...umiRouter };
// 向router中添加语言前缀的方法
const routerAddLangPrefix = params => {
  if (isString(params)) {
    params = Fn.addLangPrefix(params)
  } else {
    params.pathname = Fn.addLangPrefix(params.pathname)
  }
  return params;
};
// flow为lodash库的通用方法，第一个方法的返回值作为第二个方法的实参
myRouter.push = flow(
  routerAddLangPrefix,
  umiRouter.push
);
export default {
  // 一般方法
  Fn:Fn,
  // 校验方法
  Validate:Validate,
  // 加密方法
  Crypto:Crypto,
  // 路由
  router:myRouter
};

