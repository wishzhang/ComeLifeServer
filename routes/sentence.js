/**
 * 句子迷
 */
const router=require('../router.js')
const userModel = require('../model/user')

const Sentence=userModel.Sentence
const User=userModel.User

var multiparty = require('multiparty');
var fs = require('fs');

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
    },
    code:function (code,msg,data) {
        return JSON.stringify({
            code:code,
            msg:msg,
            data:data
        })
    }
};
router.post('/getSentences', function (req, res) {
    Sentence.find().exec(function (err, sentences) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        res.send(resObj.code0(sentences));
    })
})

router.post('/addSentence', function (req, res) {
    var form = new multiparty.Form({uploadDir: './public/images'});

    //上传完成后处理
    form.parse(req, function (err, fields, files) {

        var filesTmp = JSON.stringify(files, null, 2);

        if (err) {
            console.log('parse error: ' + err);
        } else {
            var inputFile = files.file[0];
            var uploadedPath = inputFile.path;
            var dstPath = './public/images/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });

            var sentence = new Sentence({
                content: fields.content[0],
                author: fields.author[0],
                picname:inputFile.originalFilename
            });
            sentence.save(function (err, sentence) {
                if (err) {
                    res.send(resObj.code1());
                    return;
                }
                res.send(resObj.code0());
            })
        }
    });

});

router.post('/editSentence', function (req, res) {
    var form = new multiparty.Form({uploadDir: './public/images'});

    //上传完成后处理
    form.parse(req, function (err, fields, files) {

        var filesTmp = JSON.stringify(files, null, 2);

        if (err) {
            console.log('parse error: ' + err);
        } else {
            var inputFile = files.file[0];
            var uploadedPath = inputFile.path;
            var dstPath = './public/images/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });

            Sentence.findOne({_id: fields._id[0]}, function (err, sentence) {
                if (err) {
                    debugger
                    res.send(resObj.code1());
                    return;
                }
                if (sentence) {
                    sentence.content =fields.content[0];
                    sentence.author = fields.author[0];
                    sentence.picname=inputFile.originalFilename;
                    sentence.save(function (err, sententce) {
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
        }
    });
})

router.post('/delSentence', function (req, res) {
    Sentence.findOneAndDelete({_id: req.body._id}, function (err, sentence) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        if (sentence) {
            res.send(resObj.code0());
        } else {
            res.send(resObj.code1());
        }
    })
})

/**
 * 我的喜欢
 */

router.post('/addLike',function (req,res) {
    var user_id=req.body.user_id;
    var sentence_id=req.body.sentence_id;
    User.findOne({_id:user_id}).exec(function (err,user) {
        if(err){
            res.send(resObj.code1())
            return;
        }
        if(user){
            user.likes.push(sentence_id)
            user.save(function (err,user) {
                if(err){
                    res.send(resObj.code1())
                    return
                }
                res.send(resObj.code0())
            })
        }else{
            res.send(resObj.code1())
        }
    })
})

router.post('/delLike',function (req,res) {
    var user_id=req.body.user_id;
    var sentence_id=req.body.sentence_id;
    User.findOne({_id:user_id}).exec(function (err,user) {
        if(err){
            res.send(resObj.code1())
            return
        }
        if(user){
            var index=user.likes.indexOf(sentence_id)
            if(index!==-1){
                user.likes.splice(index,1)
                user.save(function (err,user) {
                    if(err){
                        res.send(resObj.code1())
                        return
                    }
                    res.send(resObj.code0())
                })
            }
        }else{
            res.send(resObj.code1())
        }
    })
})

router.post('/getMyLikes',function (req,res) {
    var user_id=req.body.user_id;
    User.findOne({_id:user_id}).populate('likes').exec(function (err,user) {
        if(err){
            res.send(resObj.code1())
            return
        }
        if(user){
            res.send(resObj.code0(user))
        }else{
            res.send(resObj.code1())
        }
    })
})

module.exports = router;