const express=require("express");
const router=express.Router();
const Url=require("../models/data.model");
router.get("/all-data",async(req,res)=>{
    const {name}=req.query;
    try{
     const data=await Url.find({name});
     const change=data.map((val)=>({
       title:val.title,
       sub_title:val.Sub_title
     }))
     res.status(200).json({ok:true,message:"data fatched", list:change});
    }
    
    catch(err){

        console.log(err);
       res.status(401).json({ok:false,message:"data not fatched"});
    }
})
module.exports=router;