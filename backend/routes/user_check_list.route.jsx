const express=require("express");
const router=express.Router();
const CheckList=require('../models/checklist.model')
router.post('/check-list',(req,res)=>{
    console.log(req.body);
})
module.exports=router;