1. npm start 运行项目
2. npm run add-locale en 添加英文翻译文件（不确实是否必须）
3. 使用src/pages/document.ejs作为html模板渲染
4. 默认路由"/"的入口文件为src/pages/index.js文件
5. 所有路由都会默认加载母版页(src/layouts/index.js)文件
6. 在母版页中执行了以下逻辑：
  1) 初始化AntD组件的多语言控制
  2) 添加内容的多语言控制
  3) 为页面添加通用的标题内容
  4) 通过调用全局的globalModal(src/models/global.js)注册setupHistory方法来判断是否存在token，是否需要登录
  5) 同一个请求，如果代理存在，并且MOCK也存在的话，会使用mock中的数据
7. **静态资源文件必须先build一下才能访问得到**


## 项目流程步骤
1. 入口文件 src/pages/index.js,当前的router为"/"
2. 所有的路由都会加载layouts中的index.js作为母版页
3. 母版页：src/layouts/index.js,加载了多语言组件，内部通用的菜单及头部组件，以及登录页面的母版页等
4. 
