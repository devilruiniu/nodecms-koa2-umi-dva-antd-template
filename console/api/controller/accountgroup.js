/*路由*/
const router = require('koa-router')();
/*接口服务*/
const AccountGroupService = require('../service/accountgroup');
/*配置属性*/
const config = require('../config.js');
const adminPrefix = config.API.ADMIN_INTERFACE_PREFIX;
// 获取所有账户组
router.get(`${adminPrefix}/accountgroup/list`, AccountGroupService.getAccountGroupList);
// 添加一个账户组
router.post(`${adminPrefix}/accountgroup/info`,AccountGroupService.postAccountGroupInfo);
// 删除一个账户组
router.delete(`${adminPrefix}/accountgroup/info/:id`,AccountGroupService.deleteAccountGroupInfo);
// 修改一个账户组
router.put(`${adminPrefix}/accountgroup/info/:id`,AccountGroupService.putAccountGroupInfo);
module.exports = router;
