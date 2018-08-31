const mongoose=require('../dbconnect');

var coldJokeSchema = mongoose.Schema({
    content:String,
    time:{type:Date,default:Date.now}
});

var ColdJoke=mongoose.model('ColdJoke',coldJokeSchema);


module.exports=ColdJoke