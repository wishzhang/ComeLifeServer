const express = require('express');
const router = express.Router();
const UserJoke = require('./model/user');
const Sentence=require('./model/sentence');
const util = require('./utils/util');
const bodyParser = require('body-parser');
const http=require('http');

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
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE");

    //为每个访问服务器端口的用户分配token
    token = req.header('token');
    if (!token) {
        token = util.guid();
    }
    console.log('token:' + token);
    res.setHeader('token', token);
    userMeta[token] = {};
    next();
});


router.post('/talk',function(request,response){
    var params={
        "perception": {
            "inputText": {
                "text":request.body.text
            },
            "selfInfo": {
                "location": {
                    "city": '',
                    "province": ''
                }
            }
        },
        "userInfo": {
            "apiKey": '038845cf41ee4a92a0f3380dbb20b776',
            "userId": '123456'
        }
    };
    const postData = JSON.stringify(params);

    const options = {
        hostname: 'openapi.tuling123.com',
        port: 80,
        path: '/openapi/api/v2',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`状态码: ${res.statusCode}`);
        console.log(`响应头: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            response.send(resObj.code0(JSON.parse(chunk)));
            console.log(`响应主体: ${chunk}`);
        });
        res.on('end', () => {
            console.log('响应中已无数据。');
        });
    });

    req.on('error', (e) => {
        response.send(resObj.code1());
        console.error(`请求遇到问题: ${e.message}`);
    });

// 写入数据到请求主体
    req.write(postData);
    req.end();
})

/**
 * 日记
 */
router.post('/addOlive',function (req,res) {
    UserJoke.User.findOne({_id:req.body.user_id}).exec(function (err,user) {
        if(err){
            res.send(resObj.code1());
            return;
        }
        if(user){
            var olive=new UserJoke.Olive({
                content:req.body.oliveContent,
                owner:user._id
            });
            user.olives.push(olive);
            user.save(function (err,user) {
                if(err){
                    res.send(resObj.code1());
                    return;
                }
                olive.save(function (err,user) {
                    if(err){
                        res.send(resObj.code1());
                        return;
                    }
                    res.send(resObj.code0());
                })
            })
        }else{
            res.send(resObj.code1());
        }
    })
})

//TODO:更新接口可修改
router.post('/editOlive',function (req,res) {
    UserJoke.Olive.findOne({_id:req.body.olive_id},function (err,olive) {
        if(err){
            res.send(resObj.code1());
            return;
        }
        if(olive){
            olive.content=req.body.oliveContent;
            olive.save(function (err,olive) {
                if(err){
                    res.send(resObj.code1());
                    return;
                }
                res.send(resObj.code0());
            })
        }else {
            res.send(resObj.code1());
        }
    })
});

router.post('/getOlives',function (req,res) {
    UserJoke.Olive.find({owner:req.body.user_id}).exec(function (err,olives) {
        if(err){
            res.send(resObj.code1());
            return;
        }
        if(olives){
            res.send(resObj.code0(olives));
        }else{
            res.send(resObj.code1());
        }
    })
});

router.post('/deleteOlive',function (req,res) {
    UserJoke.Olive.findOneAndDelete({_id:req.body.olive_id},function (err,olive) {
        if(err){
            res.send(resObj.code1());
            return;
        }
        if(olive){
            UserJoke.User.findOne({_id:olive.owner}).exec(function (err,user) {
                if(err){
                    res.send(resObj.code1());
                    return;
                }
                if(user){
                    var olives=user.olives;
                    for(var i=0;i<olives.length;i++){
                        if(olives[i]==olive._id.toString()){
                            olives.splice(i,1);
                            i--;
                        }
                    }
                    user.save(function (err,user) {
                        if(err){
                            res.send(resObj.code1());
                            return;
                        }
                        res.send(resObj.code0());
                    })
                }else{
                    res.send(resObj.code1());
                }
            })
        }else{
            res.send(resObj.code1());
        }
    })
})

/**
 * 句子迷
 */
router.post('/getSentences',function (req,res) {
    Sentence.find().exec(function (err,sentences) {
        if(err){
            res.send(resObj.code1());
            return;
        }
        res.send(resObj.code0(sentences));
    })
})

router.post('/addSentence',function (req,res) {
    var sentence=new Sentence({
        content:req.body.content,
        author:req.body.author
    });
    sentence.save(function (err,sentence) {
        if(err){
            res.send(resObj.code1());
            return;
        }
        res.send(resObj.code0());
    })
});

router.post('/editSentence',function (req,res) {
    Sentence.findOne({_id:req.body._id},function (err,sentence) {
        if(err){
            res.send(resObj.code1());
            return;
        }
        if(sentence){
            sentence.content=req.body.content;
            sentence.author=req.body.author;
            sentence.save(function (err,sententce) {
                if(err){
                    res.send(resObj.code1());
                    return;
                }
                res.send(resObj.code0());
            })
        }else{
            res.send(resObj.code1());
        }
    })
})

router.post('/delSentence',function (req,res) {
    Sentence.findOneAndDelete({_id:req.body._id},function (err,sentence) {
        if(err){
            res.send(resObj.code1());
            return;
        }
        if(sentence){
            res.send(resObj.code0());
        }else{
            res.send(resObj.code1());
        }
    })
})




/**
 * 投诉与建议
 * 所有用户都可以进来
 */
router.post('/addFeedback',function(req,res){
    UserJoke.User.findOne({_id:req.body.user_id},function (err,user) {
        if(err){
            res.send(resObj.code1());
            return;
        }
        if(user){
            var feedback=new UserJoke.Feedback({
                feedbackContent:req.body.content,
                email:req.body.email,
                owner:req.body.user_id
            });
            user.feedbacks.push(feedback);
            user.save(function (err,user) {
                if(err){
                    res.send(resObj.code1());
                    return;
                }
                feedback.save(function (err) {
                    if(err){
                        res.send(resObj.code1());
                        return;
                    }
                    res.send(resObj.code0());
                })
            })
        }else{
            var feedback=new UserJoke.Feedback({
                feedbackContent:req.body.content,
                email:req.body.email
            })
            feedback.save(function (err,feedback) {
                if(err){
                    res.send(resObj.code1());
                    return;
                }
                res.send(resObj.code0());
            })
        }
    })
})

/**
 * collection
 */

router.post('/getUserCollections', function (req, res) {
    UserJoke.User.findOne({_id: req.body.user_id}).populate('collections').exec(function (err, user) {
        if (err) {
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
    UserJoke.Joke.findOne({_id: req.body.joke_id}, function (err, joke) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        if (joke) {
            for (var i = 0; i < joke.collectors.length; i++) {
                if (req.body.user_id == joke.collectors[i]) {
                    joke.collectors.splice(i, 1);
                    i--;
                }
            }
            joke.save(function (err, joke) {
                if (err) {
                    res.send(resObj.code1());
                    return;
                }
                UserJoke.User.findOne({_id:req.body.user_id}, function (err, user) {
                    if (err) {
                        res.send(resObj.code1());
                        return;
                    }
                    if (user) {
                        var c = user.collections;
                        for (var j = 0; j < c.length; j++) {
                            if (c[j] == req.body.joke_id) {
                                c.splice(j, 1);
                                j--;
                            }
                        }
                        user.save(function (err, user) {
                            if (err) {
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
    UserJoke.Joke.findOne({_id: req.body.joke_id}, function (err, joke) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        if (joke) {
            joke.collectors.push(req.body.user_id);
            joke.save(function (err, joke) {
                if (err) {
                    res.send(resObj.code1());
                    return;
                }
                UserJoke.User.findOne({_id:req.body.user_id}, function (err, user) {
                    if (err) {
                        res.send(resObj.code1());
                        return;
                    }
                    if (user) {
                        user.collections.push(req.body.joke_id);
                        user.save(function (err, user) {
                            if (err) {
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
 * joke
 */
router.post('/userJokeAdd', function (req, res) {
    UserJoke.User.findOne({_id: req.body.user_id}, function (err, user) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        if (user) {
            var joke = new UserJoke.Joke({
                jokeContent: req.body.jokeContent,
                owner: req.body.user_id
            });
            user.jokes.push(joke);
            // TODO,BUG:事务
            user.save(function (err, user) {
                if (err) {
                    res.send(resObj.code1());
                    return;
                }
                joke.save(function (err) {
                    if (err) {
                        res.send(resObj.code1());
                        return;
                    }
                    return res.send(resObj.code0());
                })
            });
        } else {
            //低概率出错
            res.send(resObj.code1());
        }
    })
});

router.post('/allUserJoke', function (req, res) {
    UserJoke.User.find().populate('jokes').exec(function (err, users) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        res.send(resObj.code0(users));
    })
});

router.post('/oneUserJoke', function (req, res) {
    UserJoke.User.findOne({_id: req.body._id}).populate('jokes').exec(function (err, user) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        if (user) {
            res.send(resObj.code0([user]));
        } else {
            var user = new UserJoke.User({
                nickName: req.body.nickName,
                gender: req.body.gender,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                avatarUrl: req.body.avatarUrl
            });
            user.save(function (err,user) {
                if(err){
                    res.send(resObj.code1());
                    return;
                }
                res.send(resObj.code0([user]));
            })
        }
    })
})

module.exports = router;