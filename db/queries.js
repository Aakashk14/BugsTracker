const relations = require("./models/agents")
const bugs = require("./models/bugs")
const users = require("./models/users")
const fn = require("../main/fn")
const online_model = require("./models/online")

function addagent(myid,email){
    return new Promise((resolve)=>{
            relations.findOneAndUpdate({
                email:myid
            },{'$push':{Agents:{
                email:email,
                Status:"Inactive"
            }}}).then((res)=>{
                resolve(1)
            })
        })
    }

function changestatus(email,stat){
   
relations.findOneAndUpdate({
    'Agents.email':email
},{$set:{'Agents.$.Status':stat}}).exec()
}
function selectagent(myemail){
    return new Promise((resolve)=>{
    relations.aggregate([{
        $match:{email:myemail}},{"$lookup":{
                "from":"login",
                "localField":"Agents.email",
                "foreignField":"email",
                "as":"users"
            }},{"$project":{
                "Name":"$users.name",
                "email":"$users.email"
            }}
    ]
    ).then((data)=>{
        if(data.length >0){
            resolve(data)}
            else{
                resolve(0)
            }
        }
    )
    })
}
    

function listagent(myemail,extra){
    return new Promise((resolve)=>{
        
        relations.aggregate([{
            $match:{"email":myemail}
        },{$project:{
            _id:0,
            email:"$Agents.email",
            Status:"$Agents.Status",
            password:"$Agents.otp"
        }},{$lookup:{
            "from":"login",
            "localField":"email",
            "foreignField":"email",
            "as":"result"
        }},{$project:{
            "Name":"$result.name",
            "email":"$email",
            "Status":"$Status",
            "userid":"$result.userid",
            "password":"$password",
            "firstlogin":"$result.firstlogin"
        }}
        ]).then((res)=>{
            if(res.length >0){

                resolve(res)
            }else{
                resolve(0)
            }
        })
    })
}

function online_agents(email){
    return new Promise((resolve)=>{
        
relations.aggregate([{
    $match:{"email":email}
},{$project:{
    _id:0,
    email:"$Agents.email",
}},{$lookup:{
    "from":"login",
    "localField":"email",
    "foreignField":"email",
    "as":"online"
}}]).then((res)=>{
    if(res[0].online.length >0){
    resolve(res[0].online)
    }else{
        resolve(0)
    }
})

    })
}


function otp(myid,email,otp){
    relations.findOneAndUpdate({
        email:myid,'Agents.email':email
    },{$set:{'Agents.$.otp':otp}}).exec()
}

function updatepassword(email,password,name){
    
    users.findOneAndUpdate({
        email:email
    },{password:password,name:name,firstlogin:false}).exec()
}
function create(email,name,password,level,firstlogin){
    return new Promise((resolve)=>{

        return fn.getseq().then((data)=>{
        users.find(
            {email:email}).then((result)=>{
                if(result.length==0){
                    let tn= new users({
                        email:email,
                        name:name,
                        userid:data,
                        password:password,
                        level:level,
                        firstlogin:firstlogin
                    })
                    tn.save((err,doc)=>{
                        if(err) console.log(er)
                    })
                    resolve(1)
                }else{
                    resolve(0)
                }

            })
        })
    })
}

function agentcheck(email){
    return new Promise((resolve)=>{

    relations.find({
        'Agents.email':email
    }).then((result)=>{
        if(result.length >0){
            resolve(1)
        }else{
            resolve(0)
        }

    })
})
}

function newBug(email,Name,attachment,bugid,agent,severity,filename){
    console.log("new bug",agent)

bugid= parseInt(bugid)
    bugs.find({
        email:email
    }).then((result)=>{
        if(result.length==0){
        let tn = new bugs({
            email:email,
            Bugs:{
            Name:Name,
            bugid:bugid,
            Attachment:attachment,
            Assigned:agent,
            severity:severity,
            file:filename
            }
        })
        tn.save((err,doc)=>{
            if(err) console.log(err)
        })

    }
    else{
        bugs.findOneAndUpdate({email:email},{'$push':{Bugs:{
            Name:Name,
            bugid:bugid,
            Attachment:attachment,
            Assigned:agent,
            severity:severity,
            file:filename

        }}}).exec()
    }
})}

function checklogin(email,pass){
    return new Promise((resolve)=>{
        users.find({
            email:email,
            password:pass
        },'-_id level name userid firstlogin').then((res)=>{

            if(res.length > 0){
            resolve(res[0])
            }else{
                resolve(res)
            }
        })
    })
}
function forgetpassword(email){
    return new Promise((resolve)=>{
    
    return fn.randpass().then((data)=>{
    relations.findOneAndUpdate({
        'Agents.email':email
    },{$set:{'Agents.$.otp':data}}).then((res)=>{
        if(res){
            resolve(1)
        }else{
            resolve(0)
        }
    })

})
})
}

function getboss(email,id){
return new Promise((resolve)=>{
    relations.find({
        'Agents.email':email
    },'-_id email').then((result)=>{
        if(id==1){
            users.find({
                email:result[0].email
            },'-_id userid').then((result)=>{
                resolve(result[0].userid)
            })}else{
        
            
        resolve(result[0].email)
            }
        })
    })
}

function updatebug(email,bugid,status){
        bugs.findOneAndUpdate({
            email:email,'Bugs.bugid':bugid},{$set:{'Bugs.$.stat':status}}).exec()

        }


function listbugs(email){
    return new Promise((resolve)=>{
        bugs.find({
            email:email
        },'Bugs.Name Bugs.Assigned Bugs.addedtime Bugs.Attachment Bugs.file Bugs.bugid Bugs.stat').then((result)=>{
            if(result.length >0){
                resolve(result[0].Bugs)
            }else{
                resolve(1)
            }
        })
    })
}
function listbugs_agent(boss,myemail){
return new Promise((resolve)=>{
    
bugs.aggregate([
    {
        $match:{'email':boss}
    },{$unwind:'$Bugs'},
    {$match:{'Bugs.Assigned':myemail}},
    {$project:{
        Name:"$Bugs.Name",
        Assigned:"$Bugs.Assigned",
        addedtime:"$Bugs.addedtime",
        Attachment:"$Bugs.Attachment",
        file:"$Bugs.file",
        bugid:"$Bugs.bugid",
        stat:"$Bugs.stat"

        }}]
        ).then((res)=>{
    if(res.length > 0){
    resolve(res)
    }else{
        resolve(0)
    }
})
})
}
function deletebug(email,bugid){
    return new Promise((resolve)=>{
        bugs.findOneAndUpdate({
            email:email
        },{$pull:{Bugs:{bugid:bugid}}}).exec()
        resolve(1)
}
    )}
function relationsdoc(email){
        relations.create({
            email:email
        })
    }

function getbug(email,bugid){
    return new Promise((resolve)=>{
        bugs.aggregate([{
            '$match':{'email':email}},{
            '$unwind':'$Bugs'
            },{
                '$match':{'Bugs.bugid':bugid}
            },{'$project':{
                Name:"$Bugs.Name",
                Attachment:"$Bugs.Attachment",
                File:"$Bugs.file",
                stat:"$Bugs.stat"
        
            }}
        ]).then((result)=>{
            if(result.length >0){
                let d={}
     d.bugname=result[0].Name
     d.Attachment=result[0].Attachment
     d.stat=result[0].stat
     if(result[0].Attachment==true){
     d.file=result[0].File
     }
     resolve(d)
    }
            else{
                resolve(0)
            }
        })
    })
}

function getemail(id,email){
    return new Promise(resolve=>{
    users.find({
        userid:id
    },'-_id email').then((res)=>{

        resolve(res[0].email)

    }
    )
})
}

function delete_agent(agentemail,myemail){
    return new Promise(resolve=>{
        relations.find({
            "email":email,
            "Agents.email":agentemail
        }).then((res)=>{
            if(res.length >0){
            relations.findOneAndUpdate({
                "email":myemail,
            },{$pull:{Agents:{email:agentemail}}}).then(()=>{
                
                resolve(1)
            })
        }else{
         resolve(0)

        }
    })
})
}

function delete_login(email){
    users.findOneAndDelete({
        email:email
    }).exec()
}

module.exports={
    addagent:addagent,
    delete_login:delete_login,
    delete_agent:delete_agent,
    newBug:newBug,
    showAgents:listagent,
    logins:checklogin,
    listbugs:listbugs,
    relationship:relationsdoc,
    create:create,
    updatebug:updatebug,
    getboss:getboss,
    otp:otp,
    agentcheck:agentcheck,
    changestatus:changestatus,
    getbug:getbug,
    listbugs_agent:listbugs_agent,
    deletebug:deletebug,
    selectagent:selectagent,
    forgetpassword:forgetpassword,
    updatepassword:updatepassword,
    getemail:getemail,
    online_agents:online_agents
}