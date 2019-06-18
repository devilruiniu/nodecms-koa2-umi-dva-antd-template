// china.js
/*路由*/
const router = require('koa-router')();
/*接口服务*/
const chinaService = require('../service/china.js');
// 通用获取所有省市区接口
router.get(`/china/city`, chinaService.getAllCity);

module.exports = router;
