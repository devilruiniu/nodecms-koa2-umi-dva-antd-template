/*路由*/
const router = require('koa-router')();
/*接口服务*/
const accountService = require('../service/account');
/*配置属性*/
const config = require('../config.js');
const adminPrefix = config.API.ADMIN_INTERFACE_PREFIX;
// 获取所有账户
router.get(`${adminPrefix}/account/list`, accountService.getAccountList);
// 添加一个账户
router.post(`${adminPrefix}/account/info`,accountService.postAccountInfo);
// 删除一个账户
router.delete(`${adminPrefix}/account/info/:id`,accountService.deleteAccountInfo);
// 修改一个账户
router.put(`${adminPrefix}/account/info/:id`,accountService.putAccountInfo);
module.exports = router;
