const mongoose=require('mongoose');
const connect_db=async()=>{
    try{
    await mongoose.connect("mongodb+srv://chat:1234@chat.xlmnxsi.mongodb.net/?appName=chat")
    console.log("connected to user db");
    }
    catch(err){
        console.log(err);
    }
}
module.exports=connect_db;