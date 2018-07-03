##### 开发思路（设计后在实现）
服务器监听客户端通过http协议发来的请求，由Router分发处理请求
处理请求可以分为两层，控制层和模型层，适时可以通过中间件进行处理
最后响应

##### 项目结构
- bin /www.js项目入口执行文件
- node_modules/ 安装的模块
- public/ 客户端若请求该路径，则返回该静态资源（也可选择处理）
- routes/ 路由分发，处理客户端http协议请求
- views/ 模板引擎的渲染页面，页面类型设置为html
- app.js 全局配置
- common.js 全局变量
- LICENSE 项目规定的协议
- package.json 项目的元数据
- package-lock.json 锁定安装时模块的版本
- README.md 项目说明文件

##### GITHUB
除了node_modules目录，其他文件和文件目录都上传到github.