const mysql = require('mysql');
const fs = require("fs");
const path = require("path");
const config = require("./config");
const constants = require("./constants");
const db = config.DATABASE;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');
moment.locale('zh-cn');

const pool = mysql.createPool({
    host: db.HOST,
    user: db.USER,
    password: db.PASSWORD,
    database: db.DATABASE,
    connectionLimit: db.CONNECTION_LIMIT
});
const utils = {
    // 数据库查询方法
    query: (sql, values) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    return reject(err);
                } else {
                    connection.query(sql, values, (err, rows) => {
                        connection.release();
                        if (err) {
                            return reject(err)
                        } else {
                            return resolve(rows);
                        }
                    })
                }
            })
        });
    },
    // 错误JSON
    resultErrorJson:(code=9999,message=constants.CODE_MESSAGE[9999],data={})=>{
        return {
            code:code,
            data:data,
            message:message
        }
    },
    /**
     * 翻页数据
     * @param code
     * @param message
     * @param result
     * @param pageData
     * @returns {{code: number, data: {list}, message: *}}
     */
    resultListSuccessJson:(code=10000,message=constants.CODE_MESSAGE[10000],result={},pageData={})=>{
        return {
            code:code,
            data:{
                list:result,
                ...pageData
            },
            message:message
        }
    },
    // 成功JSON
    resultSuccessJson:(code=10000,message=constants.CODE_MESSAGE[10000],data={})=>{
        return {
            code:code,
            data:data,
            message:message
        }
    },
    // 切割文件后缀名
    splitFileName:(text) =>{
        let index = text.lastIndexOf(".");
        return {
            name:text.substring(0,index),
            suffix:text.substring(index+1)
        };
    },
    // 递归创建目录
    mkdirsSync: (dirname)=>{
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (utils.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    },
    /**
     * md5加密
     * @param str
     */
    md5Encode:(str)=>{
        const md5 = crypto.createHash('md5');
        return md5.update(str).digest('hex');
    },

    /**
     * 检查token
     * @param ctx
     */
    checkToken:(ctx)=>{
        const token = ctx.headers[constants.SHS_TOKEN];
        if(token){
            // 解析
            const tokenOBj = jwt.decode(token.split(' ')[1], config.TOKEN.SECRET);
            if(tokenOBj && tokenOBj.exp <= Date.now()/1000){
                ctx.body = utils.resultErrorJson(9998,constants.CODE_MESSAGE[9998],{});
                return false;
            }else{
                return true;
            }
        }else{
            ctx.body = utils.resultErrorJson(9997,constants.CODE_MESSAGE[9997],{});
            return false;
        }
    },

    /**
     * 格式化时间
     * @param date
     * @param format
     * @returns {string}
     */
    formatDateTime:(date,format="YYYY-MM-DD HH:mm:ss")=>{
        if(moment(date).isValid()){
            return moment(date).format(format);
        }else{
            throw Error("日期格式不正确");
        }
    },
    /**
     * 更新session中的字段
     * @param ctx
     * @param keyObj
     */
    updateSession:(ctx,keyObj)=>{
        Object.keys(keyObj).forEach(key=>{
            ctx.session[key] = keyObj[key];
        })
    },
    /**
     * 是否为手机号码
     * @param value
     * @returns {boolean}
     */
    isTelephone:(value) =>{
        return /^((13[0-9])|(14[0-9])|(17[0-9])|(15[^4,\D])|(18[0-9])|(19[0-9]))\d{8}$/.test(value);
    },
};
module.exports = utils;
