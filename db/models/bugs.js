const mongoose = require('mongoose');


mongoose.set("debug",true)
const bugsDetail = new mongoose.Schema({
    Name:String,
    addedtime:{type:Date,default:Date.now},
    Attachment:Boolean,
    bugid:Number,
    Assigned:String,
    severity:String,
    file:String,
    stat:{type:Boolean,default:false}
})


const bug = new mongoose.Schema({
    email:String,
    Bugs:[bugsDetail]
})
const bugs= mongoose.model("bugs",bug,"bugs")






module.exports=bugs;