const express = require('express')
const router=express.Router();
const xlsx=require('xlsx');
const multer  = require('multer')
const User=require('../models/user.model');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'admin-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

function parseDate(value) {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (typeof value === "number") {
    return new Date(Math.round((value - 25569) * 86400 * 1000));
  }


  if (typeof value === "string" && value.includes("-")) {
    const [dd, mm, yyyy] = value.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  return new Date(value);
}






router.post("/upload-file",upload.single('file'),async(req,res)=>{
   try{
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
   

    const formattedData = data.map(row => ({
  ...row,
  ExamDate: parseDate(row.ExamDate)
}));

await User.insertMany(formattedData);

res.status(200).json({ok:true,message:"file uploaded"})
   }
   catch(err){
    console.log(err);
    res.status(400).json({ok:false,message:"error while uploading user data"})
   }
    
})
module.exports=router;