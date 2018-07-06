const mongoose=require('../dbconnect');

var jokeSchema=mongoose.Schema({
    userID:String,
    userName:String,
    iconPath:String,
    jokeContent:String,
    publishTime:Date
});

var Joke=mongoose.model('Joke',jokeSchema);

module.exports=Joke;