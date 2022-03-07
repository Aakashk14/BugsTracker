const express = require('express')
const session = require('express-session');
const app = express();
const queries = require("./db/queries")

var x_session = new session({
    secret:"abcde12",
    resave:false,
    saveUninitialized:false
})

app.use(x_session)

app.use(x_session)
app.set("view engine","ejs")
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(require("./main/main"))
app.use(require("./main/users"))
app.use(require("./main/bugs"))
app.use(require("./main/chat"))