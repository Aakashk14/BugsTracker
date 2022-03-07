const chats = require('./models/chat')

function update_chat(myid,user_id,message,turn){
    
    chats.find({
        userid:myid
    }).then((res)=>{
        if(res.length>0){
            chats.findOneAndUpdate({
                "userid":myid,
                "chats.to":user_id,
            },{"$push":{"chats.$.content":{"message":message,"sent":turn}
        }}).exec()
    }else{

        let tn = new chats({
    userid:myid,
    chats:{
        to:user_id,
        content:{
            message:message,
            turn:turn
        }
    }
})
        tn.save()
    }
})
}

function fetch_chat(myid,userid){
    return new Promise(resolve=>{
        chats.find({
            "userid":myid,
            "chats.to":userid

        },'chats').then((data)=>{
            if(data.length>0){
                resolve(data[0].chats[0].content)
            }else{
                resolve(0)
            }
        })
    })
}

module.exports={
    update_chat:update_chat,
    fetch_chat:fetch_chat
}