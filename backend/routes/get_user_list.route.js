const express=require("express");
const router=express.Router();
const user=require('../models/user.model');
const {verfy_user}=require('../middleware/user.auth');
router.get('/name-list',verfy_user,async(req,res)=>{
   try{
    const users=await user.find().select('name');
    res.status(200).json({ok:true,message:'list mil agyi bhai ',list:users});
   }
   catch(err){
    console.log(err);
    res.status(401).json({ok:false,message:"admin ki list route me erroe"});
   }
})
module.exports=router;