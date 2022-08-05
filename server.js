const express=require("express");
const path=require("path");
var app=express();
var server=app.listen(3000,function(){
    console.log("Listening on port 3000");
});
const io=require("socket.io")(server,{
    allowEIO3: true // false by default
});
app.use(express.static(path.join(__dirname,"")));
var userConnections=[];
io.on("connection",(socket)=>{
    console.log("socket id is",socket.id);
    socket.on("userconnect",(data)=>{
       console.log("userconnect",data.displayName,data.Meeting_id);
       var other_users= userConnections.filter((p)=>p.meeting_id==data.Meeting_id);
       userConnections.push({
        connectionId:socket.id,
        user_id: data.displayName,
        meeting_id: data.Meeting_id,
       });
       other_users.forEach((v)=>{
        socket.to(v.connectionId).emit("Inform_others_about_me",{
          other_user_id:data.displayName,
          connId:socket.id,
            
        })
       })
       socket.emit("Inform_me _abot_other _users",other_users);
    });
    socket.on("SDPProcess",(data)=>{
        socket.to(data.to_connid).emit("SDPProcess",{
            message: data.message,
            from_connid: socket.id,
        })
    })
});
