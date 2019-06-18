// login.js
const loginDao = require("../dao/login");
const jwt = require('jsonwebtoken');
const util = require("../utilitys");
const config = require("../config");
/**
 * 后台登录接口业务逻辑
 * @param ctx
 * @returns {Promise<boolean>}
 * @constructor
 */
exports.adminLogin = async (ctx) => {
    let account = ctx.request.body.account || '',
        password = ctx.request.body.password || '';
    if (!account || !password) {
        ctx.body = util.resultErrorJson(undefined, '账号或密码不能为空', {});
        return false;
    }
    try {
        // 获取用户信息
        let userResult = await loginDao.adminLogin(ctx, {account, password});
        // 如果用户信息获取成功
        if (userResult.length > 0) {
            // 判断用户是否删除
            if (userResult[0].meta_logic_flag === 1) {
                // 禁用
                ctx.body = util.resultErrorJson(undefined, '该账号已删除', {});
                return false;
            }
            // 判断用户是否禁用
            if (userResult[0].status === 2) {
                // 禁用
                ctx.body = util.resultErrorJson(undefined, '该账号已禁用', {});
                return false;
            }
            let id = userResult[0].id,
                token = ctx.session.token;
            // 判断是否存在token-不存在或者已过期则重新生成token
            if (!token) {
                // 生成token值
                token = jwt.sign({
                    name: account,
                    _id: id
                }, config.TOKEN.SECRET, {expiresIn: config.TOKEN.EXPIRE_TIME});
            }
            // session中保存token值
            util.updateSession(ctx, {token: token});
            // 返回数据
            ctx.body = util.resultSuccessJson(undefined, undefined, {
                account_group_id:userResult[0].account_group_id,
                name: userResult[0].name,
                token: token
            });
        } else {
            ctx.body = util.resultErrorJson(undefined, '账号或密码错误', {})
        }
    } catch (err) {
        ctx.body = util.resultErrorJson(undefined, '数据库执行语句失败', {});
    }
};
/**
 * 注销登录
 * @param ctx
 * @returns {Promise<void>}
 */
exports.adminLoginOut = (ctx) => {
    // 清空token
    util.updateSession(ctx, {token: null});
    ctx.body = util.resultSuccessJson(undefined, undefined, {});
};
