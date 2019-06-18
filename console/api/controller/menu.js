/*路由*/
const router = require('koa-router')();
/*接口服务*/
const menuService = require('../service/menu');
/*配置属性*/
const config = require('../config.js');
const adminPrefix = config.API.ADMIN_INTERFACE_PREFIX;
// 获取导航菜单接口
router.get(`${adminPrefix}/menu`, menuService.getMenu);
// 根据账户组获取菜单
router.get(`${adminPrefix}/menu/account_group/:id`, menuService.getMenuByAccountGroupId);
// 获取菜单列表
router.get(`${adminPrefix}/menu/list`, menuService.getMenuList);
// 添加一条菜单
router.post(`${adminPrefix}/menu/info`, menuService.postMenuInfo);
// 删除一条菜单
router.delete(`${adminPrefix}/menu/info/:id`,menuService.deleteMenuInfo);
// 修改一条菜单
router.put(`${adminPrefix}/menu/info/:id`,menuService.putMenuInfo);
module.exports = router;
