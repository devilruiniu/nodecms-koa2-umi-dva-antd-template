/*依赖包*/
const path = require("path");
const fs = require("fs");
const router = require('koa-router')();
/*配置文件*/
const config = require('./config.js');
const projectApiPrefix = config.API.PROJECT_INTERFACE_PREFIX;
// 读取controller文件夹中的文件
fs.readdirSync(path.join(__dirname, 'controller')).forEach((file) => {
    if (~file.indexOf('.js')) {
        let controller = require(path.join(__dirname, 'controller', file));
        // 为接口设置通用前缀
        router.use(`${projectApiPrefix}`, controller.routes(), controller.allowedMethods());
    }
});
module.exports = router;
