const express = require('express');
const { fetch_chat,update_chat } = require('../db/chats');
const db = require("../db/queries")
const router = express.Router();
const fn= require("../main/fn")

router.get("/chat",async(req,res,next)=>{
if(req.session.boss==1){
let result = await db.showAgents(req.session.userid)
if(result.length!=0){
    res.render("chat.ejs",{name:req.session.name,agents:result[0]})
}else{
    res.render("chat.ejs",{name:req.session.name})
}
}
else{
    next()
}
})
router.get("/chat",async(req,res)=>{
return fn.getid(req.session.boss).then((result)=>{


res.render("chat.ejs",{admin:result,name:req.session.name})
})
})

router.get("/updatechat",async(req,res)=>{
    let result = await fetch_chat(req.session.myid,req.query.userid)
    res.send(200,{result:result})
})

router.get("/new_chat",(req,res)=>{
   update_chat(req.session.myid,req.query.user,req.query.message,true)
   user_id=req.session.myid
   update_chat(req.query.user,user_id,req.query.message,false)

   //1-2


})
module.exports=router;