const AccountGroupDao = require("../dao/accountgroup");
const util = require("../utilitys");
const config = require("../config");
/**
 * 后台获取所有账户组接口
 * @param ctx
 * @returns {Promise<boolean>}
 * @constructor
 */
exports.getAccountGroupList = async(ctx) => {
    if(util.checkToken(ctx)){
        let pageSize = Number(ctx.query.pageSize) || config.LIMIT.PAGE_SIZE,
            pageIndex = Number(ctx.query.pageIndex) || config.LIMIT.PAGE_INDEX,
            name = ctx.query.name,
            status = ctx.query.status,
            startIndex = pageIndex*pageSize,
            endIndex = startIndex+pageSize;
        let postData = {
            startIndex,
            endIndex,
            name,
            status
        };
        try {
            let result = await AccountGroupDao.getAccountGroupList(ctx,postData),
                countRes = await AccountGroupDao.getAccountGroupCount(ctx,postData);
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
 * 添加一个账户组
 * @param ctx
 * @returns {Promise<void>}
 */
exports.postAccountGroupInfo = async(ctx) => {
    if(util.checkToken(ctx)){
        let name = ctx.request.body.name || undefined,
            description = ctx.request.body.description || '',
            menu_ids = ctx.request.body.menu_ids || undefined,
            status = ctx.request.body.status?Number(ctx.request.body.status):1;
        if(!name){
            ctx.body = util.resultErrorJson(undefined, '名称不能为空', {});
            return false;
        }
        if(!menu_ids){
            ctx.body = util.resultErrorJson(undefined, '菜单权限不能为空', {});
            return false;
        }
        try {
            // 判断是否存在该账户组数据
            let accountGroupRes = await AccountGroupDao.getAccountByName(ctx,name);
            if(accountGroupRes.length>0){
                ctx.body = util.resultErrorJson(undefined, '账户组已存在', {});
            }else{
                // 新增一条数据
                await AccountGroupDao.postAccountGroupInfo(ctx,{name,status,description,menu_ids});
                ctx.body = util.resultSuccessJson(undefined, undefined, {});
            }
        } catch (err) {
            ctx.body = util.resultErrorJson(undefined,err,{});
        }
    }
};
/**
 * 编辑一个账户组
 * @param ctx
 * @returns {Promise<void>}
 */
exports.putAccountGroupInfo = async(ctx) => {
    if(util.checkToken(ctx)){
        let description = ctx.request.body.description || '',
            name = ctx.request.body.name || undefined,
            menu_ids = ctx.request.body.menu_ids || undefined,
            id = ctx.params.id,
            status = ctx.request.body.status?Number(ctx.request.body.status):1;

        if(!name){
            ctx.body = util.resultErrorJson(undefined, '名称不能为空', {});
            return false;
        }
        if(!menu_ids){
            ctx.body = util.resultErrorJson(undefined, '菜单权限不能为空', {});
            return false;
        }
        try {
            // 修改一条数据
            await AccountGroupDao.putAccountGroupInfo(ctx,{name,status,description,menu_ids,id});
            ctx.body = util.resultSuccessJson(undefined, undefined, {});
        } catch (err) {
            ctx.body = util.resultErrorJson(undefined,err,{});
        }
    }
};
/**
 * 删除一个账户组-逻辑删除
 * @param ctx
 * @returns {Promise<void>}
 */
exports.deleteAccountGroupInfo = async(ctx) => {
    if(util.checkToken(ctx)){
        let id = Number(ctx.params.id);
        try {
            // 删除一条数据
            await AccountGroupDao.deleteAccountGroupInfo(ctx,id);
            ctx.body = util.resultSuccessJson(undefined, undefined, {});
        } catch (err) {
            ctx.body = util.resultErrorJson(undefined,err,{});
        }
    }
};
