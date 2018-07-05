#### 开发思路（设计后在实现）
服务器监听客户端通过http协议发来的请求，由Router分发处理请求
处理请求可以分为两层，控制层和模型层，适时可以通过中间件进行处理
最后响应

#### 项目结构
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

#### GITHUB
除了node_modules目录，其他文件和文件目录都上传到github.

#### 接口文档
<table>
<tr>
<th>请求方法</th>
<th>路径</th>
<th>参数</th>
<th>响应例子</th>
<th>描述</th>
</tr>

<tr>
<td>post</td>
<td>/jokeAdd</td>
<td>userID,jokeContent</td>
<td>成功：{code:0,msg:'success'}失败：{code:1,msg:'failed'}</td>
<td>提交段子</td>
</tr>

<tr>
<td>post</td>
<td>/jokeGet</td>
<td>userID</td>
<td>成功：{code:0,msg:'success',data:[{userID:'ZW',...总之是数据库里的一条段子记录}]}</td>
<td>获取用户自身发布的所有段子</td>
</tr>

<tr>
<td>post</td>
<td>/jokeGetAll</td>
<td>无</td>
<td>成功：{code:0,msg:'success',data:[{userID:'ZW',...总之是数据库里的一条段子记录}]}</td>
<td>获取所有用户自身发布的所有段子</td>
</tr>
</table>

#### help
删除远程文件夹
git rm --cached -r useless
git commit -m "remove directory from remote repository"
git push

