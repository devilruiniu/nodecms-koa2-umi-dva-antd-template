// uploadfile.js---此文件仅用来作为上传示例查看，根据业务逻辑中具体的情况，完成对应的操作
/*路由*/
const router = require('koa-router')();
/*接口服务*/
const uploadFileService = require('../service/uploadfile.js');
// 通用上传文件接口
router.post(`/uploadfile`, uploadFileService.uploadFile);
// 获取所有文件信息接口
router.get(`/getAllFiles`, uploadFileService.getAllFiles);

module.exports = router;
