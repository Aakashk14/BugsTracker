const db = require("../db/models/users")
const findbug=require("../db/models/bugs")



function getid(email){
    return new Promise((resolve)=>{
        db.find({
            email:email
        },'name userid').then((result)=>{
            resolve(result[0])
        })
    }
    )
}
async function randpass(){
var string = "abcdefgh/-ijklmnopqrstuvwxyz1234567890"
    var str="";
                  
          for(let i=0;i<10;i++){
             var rand = (Math.random()*36).toString().split(".");
             str = str + string[rand[0]];
    }
    return str;

}
function bugdir(email){
    return new Promise((resolve)=>{
        db.find({email:email},'-_id userid').then((data)=>{
            resolve(data[0].userid)
        })
    })
}

function getseq(){

    return new Promise((resolve)=>{

    
db.find({}).sort({userid:-1}).then((result)=>{
    if(result.length ==0){
        resolve(1)
    }else{
    resolve(result[0].userid+1)
    }
})
    })
}

function bugid(email){
    return new Promise((resolve)=>{
        findbug.aggregate([
            {
                "$match":{
                    "email":email
                }
            },{"$unwind":"$Bugs"},
            {$sort:{'Bugs.bugid':-1}}
        ]).then((result)=>{
            if(result.length ==0){
                resolve(1)
            }else{
            resolve(result[0].Bugs.bugid+1)
            }
        })
    })
}
module.exports={
    getseq:getseq,
    bugdir:bugdir,
    getbugid:bugid,
    randpass:randpass,
    getid:getid
}