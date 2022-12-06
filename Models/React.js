const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const reactSchema = new mongoose.Schema({
  react:{
    type: String,
    enum:["like","love","haha","wow","sad","angry"],
    required: true,
  },
  postRef:{
    type: ObjectId,
    ref: "post",
  },
    userRef:{
    type: ObjectId,
    ref: "user",
    }
});

module.exports = mongoose.model("React", reactSchema);
