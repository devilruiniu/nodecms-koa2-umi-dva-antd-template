// china.js
const chinaDao = require("../dao/china");
const util = require("../utilitys");
/**
 * 后台获取所有城市接口逻辑
 * @param ctx
 * @returns {Promise<boolean>}
 * @constructor
 */
exports.getAllCity = async(ctx) => {
    try {
        let result = await chinaDao.getAllData(ctx);
        ctx.body = util.resultSuccessJson(undefined,undefined,result);
    } catch (err) {
        ctx.body = util.resultErrorJson(undefined,err,{});
    }
};
