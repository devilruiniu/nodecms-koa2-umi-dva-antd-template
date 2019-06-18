// login.js
/*路由*/
const router = require('koa-router')();
/*接口服务*/
const loginService = require('../service/login');
/*配置属性*/
const config = require('../config.js');
const adminPrefix = config.API.ADMIN_INTERFACE_PREFIX;
// 后台-使用登录控制器实现后台登录接口
router.post(`${adminPrefix}/login`, loginService.adminLogin);
router.get(`${adminPrefix}/loginOut`, loginService.adminLoginOut);
module.exports = router;
