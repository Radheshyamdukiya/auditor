const express = require('express');
const router = express.Router();
const Url_Model=require('../models/data.model');
const {verfy_user}=require('../middleware/user.auth');

router.post('/save-media' ,verfy_user , async(req, res) => {
   const {mediaUrls,title,City,Date,Sub_title}=req.body;
   const name=req.user;
   const urls = Array.isArray(mediaUrls) ? mediaUrls : [mediaUrls];
   console.log(City,Date);
   if(!mediaUrls){
    res.status(401).json({ok:false,message:"please upload the file frist"});
   }
   try{
     await Url_Model.create({
             name,
             urls,
             title,
             Sub_title,
             City,
             Date
      })
       res.status(201).json({ok:true,message:"image uploaded"});
   }
   catch(err){
    console.log(err);
    res.status(401).json({ok:false,message:"somthing worn in url save"});

   }
});
module.exports = router;
