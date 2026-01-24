const express = require('express');
const router = express.Router();
const Url_Model=require('../models/data.model');
const {verfy_user}=require('../middleware/user.auth');

router.post('/save-media' ,verfy_user , async(req, res) => {
   const {mediaUrls,title}=req.body;
   const name=req.user;
   const urls = Array.isArray(mediaUrls) ? mediaUrls : [mediaUrls];
   if(!mediaUrls){
    res.status(401).json({ok:false,message:"please upload the file frist"});
   }
   try{
     await Url_Model.create({
             name,
             urls,
             title
      })
      console.log("video saved");
   }
   catch(err){
    console.log(err);
    res.status(401).json({ok:false,message:"somthing worn in url save"});

   }
});
module.exports = router;
