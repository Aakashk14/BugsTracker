const mongoose = require('mongoose')


const messages= new mongoose.Schema({
    message:String,
    turn:Boolean,
    date:{type:Date,default:Date.now()}
})


const chat_schema = new mongoose.Schema({
    to:Number,
content:[messages]
})

const users_chat = new mongoose.Schema({
    userid:Number,
    chats:[chat_schema]
})


const conversations = mongoose.model("conversations",users_chat);


module.exports=conversations