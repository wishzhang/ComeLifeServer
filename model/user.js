const mongoose=require('../dbconnect');

var userSchema = mongoose.Schema({
    uid:String,
    username:String,
    password:String,
    nickName:String,
    gender:Number,
    city:String,
    province:String,
    country:String,
    avatarUrl:String,
    jokes:[{type:mongoose.Schema.Types.ObjectId,ref:'Joke'}],
    collections:[{type:mongoose.Schema.Types.ObjectId,ref:'Joke'}],
    feedbacks:[{type:mongoose.Schema.Types.ObjectId,ref:'Feedback'}],
    olives:[{type:mongoose.Schema.Types.ObjectId,ref:'Olive'}]
});

var jokeSchema=mongoose.Schema({
    jokeContent:String,
    publishTime:{type:Date,default:Date.now},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    collectors:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
});

var feedbackSchema=mongoose.Schema({
    feedbackContent:String,
    email:String,
    publishTime:{type:Date,default:Date.now},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

var oliveSchema=mongoose.Schema({
    content:String,
    publishTime:{type:Date,default:Date.now},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

var User=mongoose.model('User',userSchema);
var Joke=mongoose.model('Joke',jokeSchema);
var Feedback=mongoose.model('Feedback',feedbackSchema);
var Olive=mongoose.model('Olive',oliveSchema);


module.exports={
    User:User,

    Joke:Joke,
    Feedback:Feedback,
    Olive:Olive
};