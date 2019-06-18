/*项目依赖*/
const Koa = require('koa');
const koaJson = require('koa-json');    // 用来美观的输出JSON response
const koaBody = require('koa-body');   // 文件上传
const http = require('http');
const routes = require('./routes');
const session = require('koa-session');
const koaJwt = require('koa-jwt'); //路由权限控制

const cors = require('koa-cors');

/*工具方法*/
const util = require('./utilitys.js');
/*配置文件*/
const config = require("./config.js");
/*应用实例*/
const app = new Koa();
/*配置属性*/
const {SERVICE,SESSION} = config;
// post请求
app.use(koaBody({
    // 支持文件上传
    multipart: true,
    // encoding:'gzip',
    formidable: {
        maxFileSize: config.LIMIT.UPLOAD_IMG_SIZE    // 设置上传文件大小最大限制，默认2M
    }
}));
// get提交数据的中间件
app.use(koaJson());
// 允许跨域

app.use(cors({
    maxAge: 5,
    // 前端设置了include，此处也要设置为true，否则不允许跨域
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE' , 'OPTIONS', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
// 设置响应头
app.use(async (ctx, next) => {
    ctx.set("Content-Type", "application/json");
    await next();
});
// 设置session
app.keys = [config.SECRET_KEY];
app.use(session(SESSION, app));
// 执行sql语句
app.use(async (ctx, next) => {
    ctx.execSql = util.query;
    await next();
});
// 处理401错误
app.use(async (ctx, next)=>{
    return next().catch((err) => {
        if (401 === err.status) {
            // session中保存token值
            util.updateSession(ctx,{token:null});
            ctx.status = 401;
            ctx.body = util.resultErrorJson(9998,"invalid token",{});
        }
    });
});
/*排除接口*/
app.use(koaJwt({secret:config.TOKEN.SECRET}).unless({
    path:[/^\/$/,/\/login$/,/\/china\/city$/,/\/uploadfile$/]
}));
/*路由配置*/
app.use(routes.routes());

/*web服务*/
http.createServer(app.callback())
    .listen(SERVICE.PORT)
    .on('listening', function () {
        console.log(`服务已开启，端口：${SERVICE.PORT}`)
    });

