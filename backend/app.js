const express = require("express");
const app = express();
const cookie=require('cookie-parser');
app.use(cookie());
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
app.use(express.json()); 
app.use(
  cors({
    origin: process.env.FRONTED,
    credentials:true
  })
);
app.set("trust proxy", 1);
const db=require("./db/user.db");
db();

const admin=require('./routes/admin.route');
const data=require('./routes/data_save.route')
const upload=require('./routes/upload.route');
const login=require('./routes/login.route');
const get_users=require('./routes/get_user.route');
const user_list=require('./routes/get_user_list.route');
const download=require('./routes/download.route');
app.use('/user',login);
app.use('/user' ,upload);
app.use('/user',data);
app.use('/admin/user',get_users)
app.use('/admin/user',user_list);
app.use('/admin',admin);
app.use('/admin',download);
module.exports = app;
