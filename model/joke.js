const mongoose=require('../dbconnect');

var jokeSchema=mongoose.Schema({


});

var Joke=mongoose.model('Joke',jokeSchema);

module.exports=Joke;