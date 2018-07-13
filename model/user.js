const mongoose=require('../dbconnect');

var userSchema = mongoose.Schema({
    uid:String,
    nickName:String,
    gender:Number,
    city:String,
    province:String,
    country:String,
    avatarUrl:String,
    jokes:[{type:mongoose.Schema.Types.ObjectId,ref:'Joke'}],
    collections:[{type:mongoose.Schema.Types.ObjectId,ref:'Joke'}]
});

var jokeSchema=mongoose.Schema({
    jokeContent:String,
    publishTime:{type:Date,default:Date.now},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    collectors:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
})

var User=mongoose.model('User',userSchema);
var Joke=mongoose.model('Joke',jokeSchema);



module.exports={
    User:User,
    Joke:Joke
};