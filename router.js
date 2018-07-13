const express = require('express');
const router = express.Router();
const UserJoke = require('./model/user');
const util = require('./utils/util');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var resObj = {
    code0: function (data) {
        return JSON.stringify({
            code: 0,
            msg: 'success',
            data: data
        });
    },
    code1: function (data) {
        return JSON.stringify({
            code: 1,
            msg: '服务器内部错误',
            data: data||[]
        });
    }
};

var allUserJokes = {
    currentPage: 1,
    num: 7,//每一页记录的数量
    data: []
};
//保存各个用户独立的浏览状态 如 userMeta["user1"].allUserJokes
var userMeta = {};
var token;

router.use(function (req, res, next) {
    //为每个访问服务器端口的用户分配token,
    token = req.header('token');
    if (!token) {
        token = util.guid();
    }
    console.log('token:' + token);
    res.setHeader('token', token);
    userMeta[token] = {};
    next();
});

router.post('/getUserCollections', function (req, res) {
    UserJoke.User.findOne({uid: token}).populate('collections').exec(function (err, user) {
        if (err) {
            console.log(err);
            res.send(resObj.code1());
            return;
        }
        if (user) {
            res.send(resObj.code0([user]));
        } else {
            res.send(resObj.code1([]));
        }
    })
})

router.post('/jokeCollectorRemove', function (req, res) {
    UserJoke.Joke.findOne({_id: req.body.jokeId}, function (err, joke) {
        if (err) {
            console.log(err);
            res.send(resObj.code1());
            return;
        }
        if (joke) {
            for (var i = 0; i < joke.collectors.length; i++) {
                if (req.body.userId == joke.collectors[i]) {
                    joke.collectors.splice(i, 1);
                    i--;
                }
            }
            joke.save(function (err, joke) {
                if (err) {
                    console.log(err);
                    res.send(resObj.code1());
                    return;
                }
                UserJoke.User.findOne({_id:req.body.userId}, function (err, user) {
                    if (err) {
                        console.log(err);
                        res.send(resObj.code1());
                        return;
                    }
                    if (user) {
                        var c = user.collections;
                        for (var j = 0; j < c.length; j++) {
                            if (c[j] == req.body.jokeId) {
                                c.splice(j, 1);
                                i--;
                            }
                        }
                        user.save(function (err, user) {
                            if (err) {
                                console.log(err);
                                res.send(resObj.code1());
                                return;
                            }
                            res.send(resObj.code0());
                        })
                    } else {
                        res.send(resObj.code1());
                    }
                })
            })
        } else {
            res.send(resObj.code1());
        }
    });

})

router.post('/jokeCollectorAdd', function (req, res) {
    UserJoke.Joke.findOne({_id: req.body.jokeId}, function (err, joke) {
        console.log('req.body:'+JSON.stringify(req.body));
        if (err) {
            console.log(err);
            res.send(resObj.code1());
            return;
        }
        if (joke) {
            console.log(JSON.stringify(joke));
            joke.collectors.push(req.body.userId);
            joke.save(function (err, joke) {
                if (err) {
                    console.log(err);
                    res.send(resObj.code1());
                    return;
                }
                UserJoke.User.findOne({uid:token}, function (err, user) {
                    if (err) {
                        console.log(err);
                        res.send(resObj.code1());
                        return;
                    }
                    if (user) {
                        user.collections.push(req.body.jokeId);
                        user.save(function (err, user) {
                            if (err) {
                                console.log(err);
                                res.send(resObj.code1());
                                return;
                            }
                            res.send(resObj.code0());
                        })
                    } else {
                        res.send(resObj.code1());
                    }
                })
            })
        } else {
            res.send(resObj.code1());
        }
    });

})
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
    TODO,BUG:事务
 */
router.post('/userJokeAdd', function (req, res) {
    UserJoke.User.findOne({uid: token}, function (err, user) {
        if (err) {
            console.log(err);
            res.send(resObj.code1());
            return;
        }
        if (!user) {
            var user = new UserJoke.User({
                uid: token,
                nickName: req.body.nickName,
                gender: req.body.gender,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                avatarUrl: req.body.avatarUrl
            });
            var joke = new UserJoke.Joke({
                jokeContent: req.body.jokeContent,
                owner: user._id
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
                owner: user._id
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
 * 后端不分页了-_-...
 */
router.post('/allUserJoke', function (req, res) {
    UserJoke.User.find().populate('jokes').exec(function (err, users) {
        if (err) {
            console.log(err);
            res.send(resObj.code1());
            return;
        }
        res.send(resObj.code0(users));
    })
});

router.post('/oneUserJoke', function (req, res) {
    UserJoke.User.findOne({uid: token}).populate('jokes').exec(function (err, user) {
        if (err) {
            console.log(err);
            res.send(resObj.code1());
            return;
        }
        if (user) {
            res.send(resObj.code0([user]));
        } else {
            var user = new UserJoke.User({
                uid: token,
                nickName: req.body.nickName||'',
                gender: req.body.gender||'',
                city: req.body.city||'',
                province: req.body.province||'',
                country: req.body.country||'',
                avatarUrl: req.body.avatarUrl||''
            });
            user.save(function (err,user) {
                if(err){
                    console.log(err);
                    res.send(resObj.code1());
                    return;
                }
                res.send(resObj.code0([user]));
            })
        }
    })
})

module.exports = router;