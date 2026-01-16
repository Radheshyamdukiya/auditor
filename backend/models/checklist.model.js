const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  complete: {
    type: Boolean,
    default: false
  }
});
const CheckList = mongoose.model("CheckList", checkSchema);
module.exports = CheckList;
