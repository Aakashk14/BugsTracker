const express = require('express')
const fs = require('fs');
const router = express.Router();
const fn = require("./fn")
const db = require("../db/queries")

const multer = require("multer");
const { Z_DATA_ERROR } = require('zlib');

const storage=multer.diskStorage({
    destination:async function(req,res,cb){
       let tmp =  await fn.getbugid(req.session.userid)
        dr=req.session.bugdir+"bug"+tmp+"/"
       if(fs.access(dr,(err)=>{
           if(err) console.log(err)
       })){
           cb(null,dr)
       }else{
           fs.mkdirSync(dr,{recursive:true},(err)=>{
               if(err) console.log(err)
           })
           cb(null,dr)
       }

    },
    filename:function(req,file,cb){
       a=file.originalname
        cb(null,a)


    }
})


const upload= multer({storage:storage})

var defaults=["/","/home"]

router.get(defaults,(req,res)=>{

    if(!req.session.userid){

    
    res.render("login.ejs")
    }else{
        res.redirect("/dashboard")
    }
    

})

router.get("/signup",(req,res)=>{
    if(!req.session.userid){

    
        res.render("signup.ejs")
        }else{
            res.redirect("/dashboard")
        }
        
    

    res.render("signup.ejs")
})


router.get("/dashboard",async(req,res,next)=>{
    if(!req.session.userid){
        res.redirect('/')
    }else if(req.session.firstlogin==true){
        res.render("updatepassword.ejs")
    }else{
    
    email=req.session.boss!=1?req.session.boss:req.session.userid
    await fn.bugdir(email).then((result)=>{
        let a_ = email.split("@")
        a_ = a_[0]+result
        a_="./storage/"+a_+"/"
        req.session.bugdir=a_
        
        res.render("index.ejs",{name:req.session.name,admin:req.session.boss})
    })
}
}
)


function Dircheck(dr,details){

    if(fs.access(dr,(err)=>{
        if(err) console.log(err)
    })){
        fs.writeFile(dr,details,(err)=>{
            if(err) console.log(err)
        })
    }
    else{
        let dr_ = dr.substr(0,dr.lastIndexOf("/"))+"/"
        console.log("dirrr",dr_,dr)
        
        fs.mkdirSync(dr_,{recursive:true},(err)=>{
            if(err) console.log(err)
        })
        fs.writeFile(dr,details,(err,res)=>{
            if(err) console.log(err)
        })
        
    }
}


 router.post("/submitbug",upload.single("file"),async(req,res,next)=>{
    console.log("what",req.body)
    var filename = req.file?req.file.originalname:0
    var attachment=filename!=0?true:false
    let tmp =  await fn.getbugid(req.session.userid)
    t_=req.session.bugdir+"bug"+tmp+"/"+"bug"+tmp+".txt"
     req.body.Agents=req.session.boss!=1?req.session.boss:req.body.Agents
     db.newBug(req.session.userid=req.session.boss==1?req.session.userid:req.session.boss,req.body.name,attachment,tmp,req.body.Agents,req.body.severity,filename)
     

     Dircheck(t_,req.body.details)
       next()
})

router.post("/submitbug",(req,res)=>{
    res.redirect("/dashboard")
})

router.get("/new",async(req,res)=>{
let email = req.session.boss==1?req.session.userid:req.session.boss
let admin = req.session.boss==1?1:0
       let data =  await db.selectagent(email)
        res.render("NewBug.ejs",{agents:data[0],name:req.session.name,admin:admin,email:req.session.userid})
    
    }
)




router.get("/panel",async(req,res)=>{
    if(req.session.boss!=1){
        res.redirect("/dashboard")
    }else if(req.query.error){
        next()
    }else{
    await db.showAgents(req.session.userid).then((result)=>{
        if(result!=0){
        res.render("panel.ejs",{agents:result,name:req.session.name,admin:req.session.admin})
        
    }else{
        res.render("panel.ejs",{name:req.session.name,admin:req.session.admin})
    }
})
    }
})
router.get("/panel",async(req,res)=>{
    await db.showAgents(req.session.userid).then((result)=>{
        if(result!=0){
            res.render("panel.ejs",{agents:result,name:req.session.name,admin:req.session.admin,error:1})
        
        }else{
            res.render("panel.ejs",{name:req.session.name,admin:req.session.admin,error:1})
        }
    })
        }
)



module.exports=router