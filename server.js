const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose=require('mongoose')
const session=require('express-session')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

//mongoose.connect('mongodb://localhost:27017/BugsTracker',{autoIndex:true})
app.set("view engine","ejs")
require("./main/socket_config")(io)



global.x_session = new session({
  secret:"abcde12",
  resave:false,
  saveUninitialized:false
})



app.use(x_session)
const basicAuth = require('express-basic-auth');
 app.use(basicAuth({
     users: { 'admin': 'p123' },
     challenge: true,
  }))
app.set("view engine","ejs")
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(require("./main/main"))
app.use(require("./main/users"))
app.use(require("./main/bugs"))
app.use(require("./main/chat"))
const host = "0.0.0.0"
httpServer.listen(3000,host);