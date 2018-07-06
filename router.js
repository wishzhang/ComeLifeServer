const express = require('express');
const router = express.Router();
const Joke = require('./model/joke');

var allUserJokes={
    currentPage:1,
    num:6,//每一页记录的数量
    data:[]
};//描述所有joke记录的对象


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
            res.send({code:2,msg:'fail'});
            return;
        }
        if(docs.length===0){
            res.send(JSON.stringify({code:1,msg:'empty',data:[]}));
            return;
        }
        res.send(JSON.stringify({code: 0, msg: 'success', data: docs}));
    })
})

router.get('/jokeGetAll', function (req, res) {
    console.log('req:' + JSON.stringify(req.query));
    Joke.find().exec(function(err,allJokes){
        if(err){
            res.send(JSON.stringify({code:2,msg:'fail'}))
            console.log(err);
            return;
        }
        if(allJokes.length===0){
            res.send(JSON.stringify({code:1,msg:'empty'}));
            return;
        }
        res.send(JSON.stringify({code:0,msg:'success',data:allJokes}));
    })
})

router.get('/getJokesByPage',function (req,res) {
    console.log('/getJokesByPage ',JSON.stringify(req.query));
    //查询所有用户的所有数据，并更新userJokes对象
    if(req.query.page==1){
        Joke.find().exec(function (err,allJokes) {
            if(err){
                res.send(JSON.stringify({code:2,msg:'fail'}))
                console.log(err);
                return;
            }
            if(allJokes.length===0){
                res.send(JSON.stringify({code:1,msg:'empty'}));
                return;
            }
            allUserJokes.currentPage=1;
            allUserJokes.data=allJokes;
            res.send(JSON.stringify({code:0,msg:'success',data:allUserJokes.data.slice(0,allUserJokes.num)}));
        })
    }else{ //请求下一页数据，从userJokes取数据
        var start=allUserJokes.currentPage*allUserJokes.num;
        console.log("start:"+start+" page:"+allUserJokes.currentPage);
        if(start>allUserJokes.data.length){
            res.send(JSON.stringify({code:3,msg:'没有更多数据了',data:[]}));
            return;
        }
        res.send(JSON.stringify({
            code:0,
            msg:'success',
            data:allUserJokes.data.slice(start,start+allUserJokes.num )
        }))
        allUserJokes.currentPage++;

    }
})


module.exports = router;