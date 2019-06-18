const AccountDao = require("../dao/account");
const util = require("../utilitys");
const config = require("../config");
/**
 * 后台获取所有账户接口
 * @param ctx
 * @returns {Promise<boolean>}
 * @constructor
 */
exports.getAccountList = async(ctx) => {
    if(util.checkToken(ctx)){
        let pageSize = Number(ctx.query.pageSize) || config.LIMIT.PAGE_SIZE,
            pageIndex = Number(ctx.query.pageIndex) || config.LIMIT.PAGE_INDEX,
            account = ctx.query.account,
            phone = ctx.query.phone,
            status = ctx.query.status,
            startIndex = pageIndex*pageSize,
            endIndex = startIndex+pageSize;
        let postData = {
            startIndex,
            endIndex,
            account,
            phone,
            status
        };
        try {
            let result = await AccountDao.getAccountList(ctx,postData),
                countRes = await AccountDao.getAccountCount(ctx,postData);
            let resData = {
                pageIndex,
                pageSize,
                totalCount:countRes[0].totalCount
            };
            ctx.body = util.resultListSuccessJson(undefined,undefined,result,resData);
        } catch (err) {
            ctx.body = util.resultErrorJson(undefined,err,{});
        }
    }
};
/**
 * 添加一个账户
 * @param ctx
 * @returns {Promise<void>}
 */
exports.postAccountInfo = async(ctx) => {
    if(util.checkToken(ctx)){
        let account = ctx.request.body.account || undefined,
            accountGroupId = ctx.request.body.account_group_id || undefined,
            password = ctx.request.body.password || undefined,
            phone = ctx.request.body.phone || undefined,
            name = ctx.request.body.name || undefined,
            status = ctx.request.body.status?Number(ctx.request.body.status):1;
        if (!account) {
            ctx.body = util.resultErrorJson(undefined, '账号不能为空', {});
            return false;
        }
        if (!accountGroupId) {
            ctx.body = util.resultErrorJson(undefined, '请选择账号组', {});
            return false;
        }
        if(!name){
            ctx.body = util.resultErrorJson(undefined, '名称不能为空', {});
            return false;
        }
        if(!password){
            ctx.body = util.resultErrorJson(undefined, '密码不能为空', {});
            return false;
        }
        if(!phone){
            ctx.body = util.resultErrorJson(undefined, '手机号码不能为空', {});
            return false;
        }
        if(!util.isTelephone(phone)){
            ctx.body = util.resultErrorJson(undefined, '手机号码格式不正确', {});
            return false;
        }
        try {
            // 判断是否存在该账号数据
            let accountRes = await AccountDao.getAccountByAccount(ctx,account);
            if(accountRes.length>0){
                ctx.body = util.resultErrorJson(undefined, '账户已存在', {});
            }else{
                // 新增一条数据
                await AccountDao.postAccountInfo(ctx,{account,account_group_id:Number(accountGroupId),password,name,status,phone});
                ctx.body = util.resultSuccessJson(undefined, undefined, {});
            }
        } catch (err) {
            ctx.body = util.resultErrorJson(undefined,err,{});
        }
    }
};
/**
 * 编辑一个账户
 * @param ctx
 * @returns {Promise<void>}
 */
exports.putAccountInfo = async(ctx) => {
    if(util.checkToken(ctx)){
        let phone = ctx.request.body.phone || undefined,
            accountGroupId = ctx.request.body.account_group_id || undefined,
            name = ctx.request.body.name || undefined,
            id = ctx.params.id,
            status = ctx.request.body.status?Number(ctx.request.body.status):1;
        if (!accountGroupId) {
            ctx.body = util.resultErrorJson(undefined, '请选择账号组', {});
            return false;
        }
        if(!name){
            ctx.body = util.resultErrorJson(undefined, '名称不能为空', {});
            return false;
        }
        if(!phone){
            ctx.body = util.resultErrorJson(undefined, '手机号码不能为空', {});
            return false;
        }
        if(!util.isTelephone(phone)){
            ctx.body = util.resultErrorJson(undefined, '手机号码格式不正确', {});
            return false;
        }
        try {
            // 修改一条数据
            await AccountDao.putAccountInfo(ctx,{name,status,account_group_id:Number(accountGroupId),phone,id});
            ctx.body = util.resultSuccessJson(undefined, undefined, {});
        } catch (err) {
            ctx.body = util.resultErrorJson(undefined,err,{});
        }
    }
};
/**
 * 删除一个账户-逻辑删除
 * @param ctx
 * @returns {Promise<void>}
 */
exports.deleteAccountInfo = async(ctx) => {
    if(util.checkToken(ctx)){
        let id = Number(ctx.params.id);
        try {
            // 删除一条数据
            await AccountDao.deleteAccountInfo(ctx,id);
            ctx.body = util.resultSuccessJson(undefined, undefined, {});
        } catch (err) {
            ctx.body = util.resultErrorJson(undefined,err,{});
        }
    }
};

