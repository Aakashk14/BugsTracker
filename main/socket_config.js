const db = require('../db/queries')
module.exports=function(io){
console.log("accessed")

io.use(function(socket, next) {
       
    x_session(socket.request, {}, next);
})
    io.on("connection",async (socket)=>{
    socket.request.session.rooms=[];

if(socket.request.session.boss==1){
    let users={};
   result = await db.online_agents(socket.request.session.userid)

   for(let i=0;i<result.length;i++){
       socket.join(result[i].userid)
       socket.request.session.rooms[i]=result[i].userid
   }
   socket.join(socket.request.session.myid)

 

}else{
    result =  await db.getboss(socket.request.session.userid,1)
    socket.request.session.rooms[0]=result
   socket.join(result)
   socket.join(socket.request.session.myid)
    
}

socket.on("message",(data)=>{
    for(let x of socket.request.session.rooms){
        if(data.user==x)
    socket.to(x).emit("message",data.message,socket.request.session.myid);
    break;
}
    }

)
    })
}








