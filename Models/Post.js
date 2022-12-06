const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;


const postSchema =  mongoose.Schema({
  type:{
    type: String,
    enum:['profilePicture','cover',null],
    default:null
  },
  text:{
    type:String,
  },
  images:{
    type:Array,
  },
  user:{
type:ObjectId,
ref:'user',
required:true
  },
  background:{
    type:String,
  },
  comments:[{
    comment:{
        type:String,
    },
    image:{
        type:String,
    },
    commentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    commentAt:{
        type:Date,
        required:true
    }
  }]
},{
    timestamps:true
})

module.exports = mongoose.model('post',postSchema)