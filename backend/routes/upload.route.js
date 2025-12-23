const express = require("express");
const router = express.Router();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const {verfy_user}=require('../middleware/user.auth');

router.post("/upload",verfy_user,(req,res)=>{

  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(    { timestamp },
    process.env.API_SECRET
  );

  res.json({
    timestamp,
    signature,
    apiKey: process.env.API_KEY,
    cloudName: process.env.CLOUD_NAME
  });

} );
module.exports= router;