const mongoose= require('mongoose')


const online_schema = new mongoose.Schema({
    userid:Number,
    online:Boolean
})


const online = mongoose.model("online",online_schema,"online")


module.exports=online;