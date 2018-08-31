//项目的全局配置
var express = require('express');
var path = require('path');
var Router = require('./router');
var SentenceRouter=require('./routes/sentence')
var ColdJokeRouter=require('./routes/coldjoke')

var app = express();

//应用模板引擎
app.engine('html', require('express-art-template'));

//应用模块
app.use(express.static('public'));

//应用路由
app.use(Router);

app.use(SentenceRouter)
app.use(ColdJokeRouter)

module.exports = app;

app.listen(3000,function(){
    console.log('服务器已启动...');
})