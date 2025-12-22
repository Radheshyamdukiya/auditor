const mongoose=require('mongoose');
const user_schema=new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
    required:true,
    type:String
    },
    password:{
     required:true,
     type:String
    }
})
const user=mongoose.model('user',user_schema);
module.exports=user;