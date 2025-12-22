const mongoose=require('mongoose');
const admin_schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
})
const admin=mongoose.model('admin',admin_schema);
module.exports=admin;