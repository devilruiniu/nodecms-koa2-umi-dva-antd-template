const secretKey = "devilruiniu";
module.exports = {
    // 服务器配置
    SERVICE:{
        HOST:"",
        PORT:"8081"
    },
    // 数据库连接配置
    DATABASE:{
        HOST: '47.96.182.213',
        USER: 'guobin',
        PASSWORD: 'aa123456',
        DATABASE: 'db_share-sale',
        CONNECTION_LIMIT: 10
    },
    // 接口地址配置
    API:{
        // 项目接口前缀
        PROJECT_INTERFACE_PREFIX:'/shsApi',
        // 后台接口前缀
        ADMIN_INTERFACE_PREFIX: '/adminApi',
        // 移动端接口前缀
        MOBILE_INTERFACE_PREFIX:'/mobileApi'
    },
    SESSION:{
        key: secretKey,   //cookie key (default is koa:sess)
        maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
        overwrite: true,  //是否可以overwrite    (默认default true)
        httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
        signed: true,   //签名默认true
        rolling: true,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
        renew: false,  //(boolean) renew session when session is nearly expired,
    },
    // 路径配置
    PATH:{
        UPLOAD_PATH:"public/upload"
    },
    SECRET_KEY:secretKey,
    // 配置TOKEN信息
    TOKEN:{
        SECRET:secretKey,
        // token过期时间-60分钟，3600秒
        EXPIRE_TIME:3600,
    },
    // 限制条件配置
    LIMIT:{
        // 上传图片大小2M
        UPLOAD_IMG_SIZE:200*1024*1024,
        // 翻页页面数量
        PAGE_SIZE:10,
        // 翻页第一页索引
        PAGE_INDEX:0,
        // 有些页面不需要翻页，但是数据格式为翻页的数据格式，所以需要设置改值
        MAX_PAGE_SIZE:9999,
    }
};
