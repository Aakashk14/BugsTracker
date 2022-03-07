const mongoose = require('mongoose');

const agent = new mongoose.Schema({
    email:String,
    Status:String,
    otp:{type:String,default:''},
})

const emp = new mongoose.Schema({
    email:String,
    Agents:[agent]
})

const relations = mongoose.model("relations",emp,"relations")


        


module.exports=relations