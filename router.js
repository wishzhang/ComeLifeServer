const express = require('express');
const router = express.Router();
// const Joke = require('./model/joke');
const UserJoke = require('./model/user');
const util = require('./utils/util');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
// router.use(bodyParser.raw);
// router.use(bodyParser.urlencoded);
router.use(bodyParser.json());

var resObj = {
    code0: function (data) {
        return JSON.stringify({
            code: 0,
            msg: 'success',
            data: data
        });
    },
    code1: function () {
        return JSON.stringify({
            code: 1,
            msg: '服务器内部错误',
            data: null
        });
    }
};

var resDataHandler={
    allUserJoke:function (data) {
        return{

        }
    }
}

var allUserJokes = {
    currentPage: 1,
    num: 7,//每一页记录的数量
    data: []
};
//保存各个用户独立的浏览状态 如 userMeta["user1"].allUserJokes
var userMeta = {};

router.use(function (req, res, next) {
    console.log('http request...');
    //为每个访问服务器端口的用户分配token,
    var token = req.header('token');
    if (!token) {
        token = util.guid();
    }
    res.cookie('token', token);
    userMeta[token] = {};
    next();
});
/**
 * {
    nickName:String,
    gender:Number,
    city:String,
    province:String,
    country:String,
    avatarUrl:String,
    jokeContent:String,
}
    //TODO,BUG:事务
 */
router.post('/userJokeAdd', function (req, res) {
    UserJoke.User.findOne({nickName: req.body.nickName}, function (err, user) {
        if (err) {
            console.log(err);
            res.send(resObj.code1());
            return;
        }
        if (!user) {
            var user = new UserJoke.User({
                nickName: req.body.nickName,
                gender: req.body.gender,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                avatarUrl: req.body.avatarUrl
            });
            var joke = new UserJoke.Joke({
                jokeContent: req.body.jokeContent,
                owner:user._id
            });
            user.jokes.push(joke);
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                    res.send(resObj.code1());
                    return;
                }
                joke.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(resObj.code1());
                        return;
                    }
                    res.send(resObj.code0());
                })
            });
        } else {
            var joke = new UserJoke.Joke({
                jokeContent: req.body.jokeContent,
                owner:user._id
            });
            user.jokes.push(joke);
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                    res.send(resObj.code1());
                    return;
                }
                joke.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(resObj.code1());
                        return;
                    }
                    return res.send(resObj.code0());
                })
            });
        }
    })
});
/**
 * 分页
 * page=0 第一页
 * page=1 下一页
 * 响应参考 User
 * 后端不分页了-_-...
 */
router.post('/allUserJoke', function (req, res) {
    console.log('allUserJoke...');
    UserJoke.User.find().populate('jokes').exec(function (err, users) {
        if (err) {
            console.log(err);
            res.send(resObj.code1());
            return;
        }
        res.send(resObj.code0(users));
    })
});

router.post('/oneUserJoke',function (req,res) {
    console.log('/oneUserJoke');
    console.log('req.body:'+JSON.stringify(req.body));
    UserJoke.User.findOne({nickName:req.body.nickName}).populate('jokes').exec(function (err,user) {
        if(err||!user){
            console.log(err);
            res.send(resObj.code1());
            return;
        }
        var arr=[];
        arr.push(user);
        res.send(resObj.code0(arr));
    })
})

//没有唯一，内容相同也可重复提交
/*router.get('/jokeAdd', function (req, res) {
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
    console.log('token:'+token);
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
            //以publishTime从大到小排序
            //比较器，从大到小
            var compare=function (prop) {
                return function (obj1, obj2) {
                    var val1 = obj1[prop];
                    var val2 = obj2[prop]; if (val1 > val2) {
                        return -1;
                    } else if (val1 < val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            };
            allJokes.sort(compare('publishTime'));
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
}*/

module.exports = router;