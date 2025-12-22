const express=require('express');
const router=express.Router();
const admin=require('../models/admin.model');
const{set_user}=require('../middleware/user.auth');

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    if(!email && !password){
        return res.status(404).json({ok:true,message:" all field are required"});
    }
    const user=await admin.findOne({email:email});
    if(!user){
        return res.status(404).json({ok:false,message:"user not found"});
    }
    if(user.password!=password){
         return res.status(401).json({ok:false,message:"wrong password or user"});
    }

    const token=set_user(user);
    res.cookie('cookie',token ,{
        secure:true,
        httpOnly:true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite:"None"
    })
    return res.status(200).json({ok:true,message:"correct pass "});
})
module.exports=router;