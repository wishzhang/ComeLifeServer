/*
* 冷笑话
* */
const router=require('../router.js')
const ColdJoke=require('../model/ColdJoke.js')

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

router.post('/getColdJoke', function (req, res) {
    ColdJoke.find().exec(function (err, jokes) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        res.send(resObj.code0(jokes));
    })
})

router.post('/addColdJoke', function (req, res) {
    var joke = new ColdJoke({
        content: req.body.content,
    });
    joke.save(function (err, joke) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        res.send(resObj.code0());
    })
});

router.post('/editColdJoke', function (req, res) {

    ColdJoke.findOne({_id: req.body.coldjoke_id}, function (err, joke) {
        if (err) {
            debugger
            res.send(resObj.code1());
            return;
        }
        if (joke) {
            joke.content =req.body.content;
            joke.save(function (err, joke) {
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

router.post('/delColdJoke', function (req, res) {
    ColdJoke.findOneAndDelete({_id: req.body.coldjoke_id}, function (err, joke) {
        if (err) {
            res.send(resObj.code1());
            return;
        }
        if (joke) {
            res.send(resObj.code0());
        } else {
            res.send(resObj.code1());
        }
    })
})

module.exports=router;