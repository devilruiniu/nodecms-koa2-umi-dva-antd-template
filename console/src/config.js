// 此处必须使用module.exports，不能使用export default，如果使用export default 在.umirc.js文件中引入会报错
module.exports = {
  // 固定顶部
  fixedHeader: true,
  project:{
    name:"Share Sale Admin",
    copyright: 'Share Sale Admin  © 2019 devilruiniu',
    logoPath: '/logo.svg',
    footerLinks:[
      {
        key: 'github',
        title: "github",
        href: 'https://github.com/devilruiniu/00-02-per-share-sale.git',
        blankTarget: true,
      },
    ]
  },
  api:{
    // 线上环境接口地址
    interfaceUrl:"http://localhost:8081/shsApi/",
  },
  // 多语言配置项,en,zh
  i18n: {
    // 默认语言
    defaultLanguage: 'zh',
    // 语言配置项
    languages: [
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
  },
};
