# nodecms-koa2-umi-dva-antd-template
一个完整的前后端后台框架解决方案
## 技术栈
1. 后端使用koa2搭建，只提供接口
2. 前端使用umi+dva+antd构建初始项目
## 功能点
1. 登录(token校验)
2. 账户列表增删该
3. 账户组增删该
4. 账户组权限分配
5. 菜单的增删该
## 基本环境要求
1. node：> v8.11.2
2. 全局安装umi：npm install -g umi
3. mysql环境，主机：localhost,账号为root,密码为123456

## koa2接口开发项目运行步骤
1. git获取代码
2. 打开mysql管理工具，执行/db/init.sql文件（注意：生成的sql文件是使用heidisql工具生成的，其他工具可能不能顺利执行该init.sql文件）
3. 进入/api文件夹下，执行npm install 完成之后执行npm satrt
4. 浏览器中输入http://localhost:8081/shsApi/china/city 显示正确的城市信息表示项目部署成功

## umi+dva+antd项目运行步骤
1. 进入/console文件夹下，执行npm install 完成之后执行npm start
2. 浏览器中输入http://localhost:8001 跳转到登陆页面即项目部署成功

## 注意事项
1. 先运行接口项目
2. 接口项目运行成功之后运行umi项目才能正常调用接口
