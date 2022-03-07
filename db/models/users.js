const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    userid:Number,
    level:Boolean,
    firstlogin:{type:Boolean,default:false}
})

const logins = mongoose.model("login",users,"login")


module.exports=logins