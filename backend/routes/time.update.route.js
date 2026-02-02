const express=require('express');
const router=express.Router();
const User=require("../models/user.model");
const { verfy_user }=require("../middleware/user.auth");
router.post("/timing-submit",verfy_user,async(req,res)=>{
    const {Auditor,Student,Exam}=req.body
    const {email}=req.user;
      if(Auditor.trim()=="" || Student.trim()==="" || Exam.trim()===""){
        res.status(400).json({ok:false,message :"all fields required"});
        return;
    }
    try{
       const c_user=await User.findOneAndUpdate({email:email},{Auditor_Reporting_Time:Auditor, Student_Entry_Time:Student,Exam_Starting_Time:Exam},{new:true,select:"-password"})
       res.status(201).json({ok:true,data:c_user});
       return
    }
catch(err){
    console.log(err);
    res.status(400).json({ok:false,message :"some error in saving timing"});
}
})
module.exports=router;