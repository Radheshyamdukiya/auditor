const express=require('express');
const router=express.Router();
const Feedback=require("../models/student_feedback");
const { verfy_user } = require('../middleware/user.auth');
router.post("/student_feedback",verfy_user,async(req,res)=>{
    const auditer_name=req.user;
    const {feedback,data}=req.body;
   const userData = { 
    auditer_name,
  ...data,     
  feedback      
};
 console.log(userData);
try{
    await Feedback.create(userData);
    res.status(201).json({ok:true,message:"data saved sucsefuly "});
    
}
catch(err){
    console.log(err);
    res.status(401).json({ok:false,message:"data notsaved"});
}


})
module.exports=router;