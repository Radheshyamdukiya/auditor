const express=require("express");
const router=express.Router();
const Url=require("../models/data.model");
router.get("/all-data",async(req,res)=>{
    const {name}=req.query;
    console.log(name);
    try{
     const data=await Url.find({name});
     console.log(data);
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
router.get('/center/gallery/:centercode', async (req, res) => {
  try {
    console.log("Hellow")
    const { centercode } = req.params;

    if (!centercode) {
      return res.status(400).json({ success: false, message: "Center code is required" });
    }
    const galleryData = await Url.find({ Centercode: centercode }).sort({ Date: -1 });

    res.status(200).json({ 
      success: true, 
      count: galleryData.length,
      data: galleryData 
    });

  } catch (error) {
    console.error("Gallery Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error in fetching gallery data" });
  }
});
module.exports=router;