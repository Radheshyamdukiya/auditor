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
    res.status(201).json({ok:true,message:"data saved successfully "});
    
}
catch(err){
    console.log(err);
    res.status(401).json({ok:false,message:"data notsaved"});
}


})

router.get("/get/student-feedback",async(req,res)=>{
    const {name}=req.query;
    try{
const feedback_list=  await Feedback.find({auditer_name:name});
  res.status(200).json({ok:true, message:"Feedback fatched" , student_feedback:feedback_list});
    }
    catch(err){
        console.log(err);
         res.status(401).json({ok:false,message:"data faild to getting error in feedback"});
    }

    
})

module.exports=router;