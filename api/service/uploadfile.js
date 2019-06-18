// uploadfile.js---此文件仅用来作为上传示例查看，根据业务逻辑中具体的情况，完成对应的操作
const path = require("path");
const fs = require("fs");
const uploadFileDao = require("../dao/uploadfile");
const util = require("../utilitys");
const config = require("../config");
const uploadPath = config.PATH.UPLOAD_PATH;
/**
 * 单个上传文件接口
 * @param ctx
 * @returns {Promise<boolean>}
 * @constructor
 */
exports.uploadFile = async(ctx) => {
    // 文件
    const file = ctx.request.files.file; // 获取上传文件
    // 获取文件后缀名
    const fileName = util.splitFileName(file.name).name;
    // 获取文件后缀名
    const suffix = util.splitFileName(file.name).suffix;
    // 新生成的文件名称
    const newFileName =`${new Date().getTime()}.${suffix}`;
    // 文件上传分类
    const category = ctx.request.body.category || '';
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    // 设置上传文件路径及名称
    const filePath = path.join(__dirname, '..',uploadPath,category,`/${newFileName}`);
    // 服务器相对路径
    const serviceUrl = `${uploadPath}/${category}/${newFileName}`;
    // 递归创建目录 同步方法
    util.mkdirsSync(path.join(__dirname, '..',uploadPath,category));
    // 如果文件夹存在，则创建可写流
    const upStream = fs.createWriteStream(filePath);
    try {
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        let result = await uploadFileDao.uploadFile(ctx,{url:serviceUrl,fileName});
        ctx.body = util.resultSuccessJson(undefined,"上传成功",{});
    } catch (err) {
        ctx.body = util.resultErrorJson(undefined,err.message||"error",{});
    }
};
/**
 * 获取所有文件信息
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getAllFiles = async(ctx)=>{
    try {
        let result = await uploadFileDao.getAllFiles(ctx);
        ctx.body = util.resultSuccessJson(undefined,undefined,result);
    } catch (err) {
        ctx.body = util.resultErrorJson(undefined,err,{});
    }
}
