const mongoose=require('../dbconnect');
var sentenceSchema=mongoose.Schema({
    content:String,
    author:String
});

var Sentence=mongoose.model('Sentence',sentenceSchema);
module.exports=Sentence;