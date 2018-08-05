#### 开发思路（设计后在实现）
服务器监听客户端通过http协议发来的请求，由Router分发处理请求
处理请求可以分为两层，控制层和模型层，适时可以通过中间件进行处理
最后响应

#### 项目结构
- node_modules/ 安装的模块
- public/ 客户端若请求该路径，则返回该静态资源（也可选择处理）
- routes/ 路由分发，处理客户端http协议请求
- views/ 模板引擎的渲染页面，页面类型设置为html
- app.js 项目入口文件和全局配置
- common.js 全局变量
- LICENSE 项目规定的协议
- package.json 项目的元数据
- package-lock.json 锁定安装时模块的版本
- README.md 项目说明文件

#### GITHUB
除了node_modules目录，其他文件和文件目录都上传到github.

#### 接口文档(根据postman工具维护)
<table>
<tr>
<th>请求方法</th>
<th>路径</th>
<th>参数</th>
<th>响应例子</th>
<th>描述</th>
<td>可用</td>
</tr>

<tr>
<td>post</td>
<td>/userJokeAdd</td>
<td></td>
<td></td>
<td>添加段子</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/allUserJoke</td>
<td></td>
<td></td>
<td>获取所有段子</td>
<td>是</td>
</tr>


<tr>
<td>post</td>
<td>/oneUserJoke</td>
<td></td>
<td></td>
<td>获取个人发布的段子</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/jokeCollectorAdd</td>
<td></td>
<td></td>
<td>添加到我的收藏</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/jokeCollectorRemove</td>
<td></td>
<td></td>
<td>从我的收藏删除</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/getUserCollections</td>
<td></td>
<td></td>
<td>获取我收藏的所有段子</td>
<td>是</td>
</tr>


<tr>
<td>post</td>
<td>/addFeedback</td>
<td></td>
<td></td>
<td>提交投诉与建议</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/addSentence</td>
<td></td>
<td></td>
<td>提交句子</td>
<td>是</td>

<tr>
<td>post</td>
<td>/getSentences</td>
<td></td>
<td></td>
<td>获取所有句子</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/addSentence</td>
<td>content，author</td>
<td></td>
<td>添加句子</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/editSentence</td>
<td>_id，content，author</td>
<td></td>
<td>编辑句子</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/delSentence</td>
<td>_id</td>
<td></td>
<td>删除句子</td>
<td>是</td>
</tr>

</table>

#### 页面功能实现
- jokeAdd发布段子  
面向对象，通过运用对象，达到目标。一个jokeAdd的Page对象里的目标是将用户的段子信息提交并
处理反馈。所以弄个对象来采集基础信息，弄个负责发送信息的，弄个处理xxx的，结束。

#### 软件控制
- 健壮性  
描述：任何一句代码都有可能发生错误。程序初步处理发生错误较高概率的地方。  
	- 出错响应(让用户有路可走)

#### help


