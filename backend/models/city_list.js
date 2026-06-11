const mongoose = require('mongoose');

const cityCentreSchema = new mongoose.Schema({
    Zone: { type: String },
    Status: { type: String }, 
    City: { type: String },
    CentreName: { type: String },
    CentreAddress: { type: String },
    CentreLandmark: { type: String },
    Pincode: { type: String },
    CenterCode: { type: String } // Tera extra field
}, { timestamps: true });

const cityList = mongoose.model('CityCentre', cityCentreSchema);
module.exports=cityList;