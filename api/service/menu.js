// menu.js
const menuDao = require("../dao/menu");
const util = require("../utilitys");
const config = require("../config");
/**
 * 获取导航菜单
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getMenu = async(ctx) => {
    try {
        if(util.checkToken(ctx)){
            let result = await menuDao.getMenu(ctx);
            ctx.body = util.resultSuccessJson(undefined,undefined,result);
        }
    } catch (err) {
        ctx.body = util.resultErrorJson(undefined,err,{});
    }
};
/**
 * 获取表格菜单
 * @param ctx
 * @returns {Promise<boolean>}
 * @constructor
 */
exports.getMenuList = async(ctx) => {
    try {
        if(util.checkToken(ctx)){
            let pageSize = config.LIMIT.MAX_PAGE_SIZE,
                pageIndex = Number(ctx.query.pageIndex) || config.LIMIT.PAGE_INDEX,
                startIndex = pageIndex*pageSize,
                name = ctx.query.name,
                status = ctx.query.status,
                endIndex = startIndex+pageSize;
            let postData = {
                startIndex,
                endIndex,
                name,
                status
            };
            let result = await menuDao.getMenuList(ctx,postData),
                countRes = await menuDao.getMenuCount(ctx,postData);
            let resData = {
                pageIndex,
                pageSize,
                totalCount:countRes[0].totalCount
            };
            ctx.body = util.resultListSuccessJson(undefined,undefined,result,resData);
        }
    } catch (err) {
        ctx.body = util.resultErrorJson(undefined,err,{});
    }
};
/**
 * 添加一个菜单
 * @param ctx
 * @returns {Promise<void>}
 */
exports.postMenuInfo = async(ctx) => {
    try {
        if(util.checkToken(ctx)){
            let name = ctx.request.body.name || undefined,
                icon = ctx.request.body.icon || undefined,
                route = ctx.request.body.route || undefined,
                level = ctx.request.body.level ? Number(ctx.request.body.level) : 1,
                parent_id = ctx.request.body.parent_id ? Number(ctx.request.body.parent_id):0,
                path = ctx.request.body.path||undefined,
                is_nav_menu = ctx.request.body.is_nav_menu ? Number(ctx.request.body.is_nav_menu) :1,
                status = ctx.request.body.status?Number(ctx.request.body.status):1;
            if(!name){
                ctx.body = util.resultErrorJson(undefined, '名称不能为空', {});
                return false;
            }
            try {
                // 获取最大id值
                let maxIdRes = await menuDao.getMaxId(ctx);
                if(!path){
                    path = maxIdRes[0].id+1;
                }else{
                    path = `${path}|${maxIdRes[0].id+1}`
                }
                // 新增一条数据
                await menuDao.postMenuInfo(ctx,{name,icon,route,level,path,parent_id,status,is_nav_menu});
                ctx.body = util.resultSuccessJson(undefined, undefined, {});
            } catch (err) {
                ctx.body = util.resultErrorJson(undefined,err,{});
            }
        }
    } catch (err) {
        ctx.body = util.resultErrorJson(undefined,err,{});
    }
};
/**
 * 编辑一个菜单
 * @param ctx
 * @returns {Promise<boolean>}
 */
exports.putMenuInfo = async(ctx) => {
    if(util.checkToken(ctx)){
        let name = ctx.request.body.name || '',
            icon = ctx.request.body.icon || undefined,
            route = ctx.request.body.route || undefined,
            level = ctx.request.body.level ? Number(ctx.request.body.level) : 1,
            parent_id = ctx.request.body.parent_id ? Number(ctx.request.body.parent_id):0,
            path = ctx.request.body.path||undefined,
            id = ctx.params.id,
            is_nav_menu = ctx.request.body.is_nav_menu ? Number(ctx.request.body.is_nav_menu) :1,
            status = ctx.request.body.status?Number(ctx.request.body.status):1;
        if(!name){
            ctx.body = util.resultErrorJson(undefined, '名称不能为空', {});
            return false;
        }
        try {
            // 修改一条数据
            await menuDao.putMenuInfo(ctx,{name,icon,route,level,path,parent_id,status,is_nav_menu,id});
            ctx.body = util.resultSuccessJson(undefined, undefined, {});
        } catch (err) {
            ctx.body = util.resultErrorJson(undefined,err,{});
        }
    }
};
/**
 * 删除一个菜单-逻辑删除
 * @param ctx
 * @returns {Promise<void>}
 */
exports.deleteMenuInfo = async(ctx) => {
    if(util.checkToken(ctx)){
        let id = Number(ctx.params.id);
        try {
            // 删除一条数据
            await menuDao.deleteMenuInfo(ctx,id);
            ctx.body = util.resultSuccessJson(undefined, undefined, {});
        } catch (err) {
            ctx.body = util.resultErrorJson(undefined,err,{});
        }
    }
};
/**
 * 根据账户组id获取导航菜单
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getMenuByAccountGroupId = async(ctx) => {
    try {
        if(util.checkToken(ctx)){
            let id = Number(ctx.params.id);
            let result = await menuDao.getMenuByAccountGroupId(ctx,id);
            ctx.body = util.resultSuccessJson(undefined,undefined,result);
        }
    } catch (err) {
        ctx.body = util.resultErrorJson(undefined,err,{});
    }
};

