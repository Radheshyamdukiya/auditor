const mongoose=require('mongoose');

const student_feedback=new mongoose.Schema({
    auditer_name:{
        required:true,
        type:String
    },
    Student_Name:{
        required:true,
        type:String
    },
    Reg_No:{
      required:true,
      type:String
    },
    Mobile_No:{
        required:true,
        type:String
    },
    Time:{
        required:true,
        type:String
    },
    Suggestion:{
      required:true,
      type:String
    },
    feedback:[
        {
            title:{
                required:true,
                type:String
            },
            rating:{
                required:true,
                type:String
            }
        }

    ]
    
})

const Feedback=mongoose.model('Feedback',student_feedback);
module.exports=Feedback;