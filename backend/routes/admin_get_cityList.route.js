const express=require('express');
const router=express.Router();
const city_List=require("../models/city_list");
router.get("/get_city_list",async(req,res)=>{
    try{
        const city= await city_List.find();
        return res.status(201).json({ok:true,message:"City List is Fatched ",List:city});
    }
    catch(err){
        console.log(err);
            return res.status(404).json({ok:false,message:"Eror whule geting City List"});
    }
    
})

module.exports=router;