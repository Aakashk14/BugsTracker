const express = require('express');
const db = require("../db/queries")
const fn= require("./fn")
const router=  express.Router();

var defaults=["/","/home"]
router.post("/create",async(req,res,next)=>{
    if(req.body.email.indexOf("@") > -1 && req.body.name.length > 1 && req.body.password.length >1){
        next()
    }else{
        res.set('Content-Type','text/html');
        res.send(Buffer.from('<script>alert("Fill all the details"); window.location.href="/"</script>'))
    }
})



router.post("/create",async(req,res,next)=>{
await db.agentcheck(req.body.email).then((result)=>{
    if(result==0){

        next()

    }else{
        res.send("ERROR, can't create account ,someone added you as an agent ")
    }
})
})
router.post("/create",async(req,res)=>{
await db.create(req.body.email,req.body.name,req.body.password,1,0).then((result)=>{
    if(result ==1){
        db.relationship(req.body.email)
        res.redirect("/created");
    }else{
        res.send("Email exist ,Login")
    }

})
})

router.post("/login",async(req,res,next)=>{
    await db.logins(req.body.email,req.body.password).then((result)=>{
        if(result.length!=0){

            req.session.userid=req.body.email
            req.session.name=result.name
            req.session.myid=result.userid
            req.session.firstlogin=result.firstlogin
            if(result.level==true){
                req.session.boss=1;
            res.redirect("/dashboard")
            } else{
                next()
            }
        }else{
            res.send("Email doesn't exist or invalid logins")
        }
    })
})

router.post("/login",async(req,res)=>{
    db.changestatus(req.body.email,"Active")
    await db.getboss(req.body.email).then((result)=>{
        req.session.boss=result
        
        res.redirect("/dashboard")
    })
})

router.post("/add",async(req,res)=>{
    await db.addagent(req.session.userid,req.body.value).then((result)=>{
        if(result==1){
            return fn.randpass().then((a_)=>{
            db.create(req.body.value,"temp",a_,0,1)

            db.otp(req.session.userid,req.body.value,a_)
            res.send(a_)
            })
        }else{
            res.send("0")
        }
    })

})

router.get("/created",(req,res)=>{
    res.set('Content-Type','text/html');
    res.send(Buffer.from('<script>alert("created"); window.location.href="/"</script>'))
})


router.post("/forgetpassowrd",async(req,res)=>{
    db.changestatus(req.body.email,"InActive")

    await db.forgetpassword(req.body.value).then((result)=>{
        if(result==1){
            res.send("1")
        }else{
            res.send("0")
        }
    })
})

router.post("/updatepassword",async(req,res)=>{
    
    await db.agentcheck(req.session.userid).then(async(result)=>{
        if(result.length !=0){
            await db.updatepassword(req.session.userid,req.body.password,req.body.name)
            req.session.firstlogin=false;
            req.session.name=req.body.name
            res.redirect("/dashboard")
        }
    })
})
router.get("/delete_user",async(req,res)=>{
    await db.getemail(req.query.user).then(async(result)=>{
        await db.delete_agent(result,req.session.userid).then((result)=>{
            db.delete_login(req.query.user)
            if(result==1){
                res.redirect("/panel")
            }else{
                res.redirect("/panel?error=1")
            }
        })
    })

})

router.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/")

})
module.exports=router;