const express= require('express')
const fs = require('fs')
const router = express.Router()
const db = require("../db/queries")
const path = require("path")





router.get("/files/:bugid/:image",(req,res)=>{
    let t= "bug"+req.params.bugid+"/"+req.params.image
    res.sendFile(path.join(__dirname,`../${req.session.bugdir}/${t}`))
}
)
router.get("/bugs/:bugid",async(req,res)=>{

    email=req.session.boss!=1?req.session.boss:req.session.userid
    await db.getbug(email,parseInt(req.params.bugid)).then((d)=>{


     
     d.data  = fs.readFileSync(req.session.bugdir+"bug"+req.params.bugid+"/"+"bug"+req.params.bugid+".txt","utf-8")
    res.render("BugReport.ejs",{data:d,bugid:req.params.bugid,name:req.session.name,admin:req.session.boss})


})
})
router.get("/delete/:bugid",async(req,res)=>{

    email=req.session.boss!=1?req.session.boss:req.session.userid

      await db.deletebug(email,req.params.bugid).then(()=>{
          
          res.redirect("/Bugs")
      })
})



router.get("/Bugs",async(req,res)=>{
    if(req.session.boss!=1){
       let result= await db.listbugs_agent(req.session.boss,req.session.userid)
            res.render("Bugs.ejs",{bugs:result,name:req.session.name,admin:req.session.boss})
    }else{
    let result=await db.listbugs(req.session.userid)
    
    res.render("Bugs.ejs",{bugs:result,name:req.session.name,admin:req.session.boss})
}
})

router.post("/changestatus",(req,res)=>{
    email=req.session.boss!=1?req.session.boss:req.session.userid
    stat=req.body.status=="Close Bug"?true:false
    db.updatebug(email,req.body.bugid,stat)
})
module.exports=router