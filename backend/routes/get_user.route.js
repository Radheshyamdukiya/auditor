const express=require('express');
const router=express.Router();
const Url=require('../models/data.model');
const {verfy_user}=require('../middleware/user.auth');
router.get('/list',verfy_user,async(req,res)=>{
  try{
        const { name,title} = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "username required",
      });
    }
    const users=await Url.find({name:name,title:title});
    
    if(!users){
      return   res.status(401).json({ok:false,message:"not users found"});
    }
    res.status(200).json({ok:true,message:"users fatched" ,data:users})
  }
  catch(err){
    console.log(err);
     return   res.status(401).json({ok:false,message:"error in geting user"});
  }

})
module.exports=router;