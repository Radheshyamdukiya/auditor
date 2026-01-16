const express = require("express");
const app = express();
const cookie=require('cookie-parser');
app.use(cookie());
const dotenv = require("dotenv");
dotenv.config();
app.set("trust proxy", 1);
const cors = require("cors");
app.use(express.json()); 
app.use(
  cors({
    origin: process.env.FRONTED,
    credentials:true
  })
);

const db=require("./db/user.db");
db();

const admin=require('./routes/admin.route');
const data=require('./routes/data_save.route')
const upload=require('./routes/upload.route');
const login=require('./routes/login.route');
const get_users=require('./routes/get_user.route');
const user_list=require('./routes/get_user_list.route');
const download=require('./routes/download.route');
const user_data_upload=require('./routes/admin.user.data.upload.routes')
const checklist=require('./routes/user_check_list.route.jsx');
const student_feedback=require('./routes/student.feedback.route.js');
app.use('/user',login);
app.use('/user' ,upload);
app.use('/user',data);
app.use('/user',checklist); 
app.use('/user',student_feedback);
app.use('/admin/user',get_users)
app.use('/admin/user',user_list);
app.use('/admin',admin);
app.use('/admin',download);
app.use('/admin',user_data_upload);
module.exports = app;
