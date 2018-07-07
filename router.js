const express = require('express');
const router = express.Router();
const Joke = require('./model/joke');
const util = require('./utils/util');

//一个用户获取到的（个人或所有人）joke记录的对象，注意下面仅用于初始赋值给
// userMeta["user1"].allUserJokes
var allUserJokes = {
    currentPage: 1,
    num: 6,//每一页记录的数量
    data: []
};
//保存各个用户独立的浏览状态 如 userMeta["user1"].allUserJokes ,临时用户即userID:""的，生成一个
var userMeta = {};


router.get('/', function (req, res) {
    res.send('heLLo');
})

//没有唯一，内容相同也可重复提交
router.get('/jokeAdd', function (req, res) {
    console.log('req：' + JSON.stringify(req.query));
    var joke = new Joke(req.query);
    joke.publishTime = new Date();
    joke.save(function (err) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({code: 2, msg: 'fail'}));
            return;
        }
        res.send(JSON.stringify({code: 0, msg: 'success'}));
    })
})

router.get('/jokeGet', function (req, res) {
    console.log('req:' + JSON.stringify(req.query));
    Joke.find(req.query, function (err, docs) {
        if (err) {
            console.log(err);
            res.send({code: 2, msg: 'fail'});
            return;
        }
        if (docs.length === 0) {
            res.send(JSON.stringify({code: 1, msg: 'empty', data: []}));
            return;
        }
        res.send(JSON.stringify({code: 0, msg: 'success', data: docs}));
    })
})

router.get('/jokeGetAll', function (req, res) {
    console.log('req:' + JSON.stringify(req.query));
    Joke.find().exec(function (err, allJokes) {
        if (err) {
            res.send(JSON.stringify({code: 2, msg: 'fail'}))
            console.log(err);
            return;
        }
        if (allJokes.length === 0) {
            res.send(JSON.stringify({code: 1, msg: 'empty'}));
            return;
        }
        res.send(JSON.stringify({code: 0, msg: 'success', data: allJokes}));
    })
})

router.get('/getJokesByPage', function (req, res) {
    console.log('/getJokesByPage ', JSON.stringify(req.query));
    responseGetJokesByPage(req, res);
})

function responseGetJokesByPage(req, res) {
    //isAll:""查询所有用户joke记录，否则查询对应用户joke记录
    var isAll = req.query.isAll;
    var con;
    //若首次进入首页，分配token，以保持访问状态(默认认为其他页面请求已有token)
    var token = req.get('token');
    if (!token) {
        token = util.guid();
    }
    res.setHeader('token', token);
    //请求第一页数据
    if (req.query.page == 1) {
        if (isAll == 0) {
            con = {userID: req.query.userID};
        }
        Joke.find(con).exec(function (err, allJokes) {
            console.log('allJokes:'+allJokes.length);
            if (err) {
                res.send(JSON.stringify({code: 2, msg: 'fail'}))
                console.log(err);
                return;
            }
            if (allJokes.length === 0) {
                res.send(JSON.stringify({code: 1, msg: 'empty'}));
                return;
            }
            userMeta[token] = {
                allUserJokes: allUserJokes
            };
            userMeta[token].allUserJokes.currentPage = 1;
            userMeta[token].allUserJokes.data = allJokes;
            res.send(JSON.stringify({
                code: 0,
                msg: 'success',
                data: userMeta[token].allUserJokes.data.slice(0, userMeta[token].allUserJokes.num)
            }));
        })
    } else { //请求下一页数据
        var start = userMeta[token].allUserJokes.currentPage * userMeta[token].allUserJokes.num;
        if (start > userMeta[token].allUserJokes.data.length) {
            res.send(JSON.stringify({code: 3, msg: '没有更多数据了', data: []}));
            return;
        }
        res.send(JSON.stringify({
            code: 0,
            msg: 'success',
            data: userMeta[token].allUserJokes.data.slice(start, start + userMeta[token].allUserJokes.num)
        }))
        userMeta[token].allUserJokes.currentPage++;
    }
}

module.exports = router;