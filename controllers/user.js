const {
  validationEmail,
  validationLength,
  userNameValidation,
} = require("../helpers/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Post = require('../Models/Post');
const Code = require("../Models/Code");
const { sendVerifactionEmail, sendResetCode } = require("../helpers/mailer");
const genaretCodeReset = require("../helpers/genaretCodeReset");
const { genaretCode } = require("../helpers/token");
const mongoose = require("mongoose");
exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;
    //email validation
    if (!validationEmail(email)) {
      return res.status(400).json({
        messages: "Unvalid Email Address",
      });
    }
    const check = await User?.findOne({ email });
    if (check) {
      return res.status(400).json({
        messages: "This email is already Exists Try Another One",
      });
    }
    //first name validation
    if (!validationLength(first_name, 3, 30)) {
      return res.status(400).json({
        messages: "First Name Must Be Between 3 And 30 Characters",
      });
    }
    //last name validation
    if (!validationLength(last_name, 3, 30)) {
      return res.status(400).json({
        messages: "Last Name Must Be Between 3 And 30 Characters",
      });
    }
    //password validation
    if (!validationLength(password, 6, 30)) {
      return res.status(400).json({
        messages: "Password Must Be 6 Characters",
      });
    }
    const cryptedPassword = await bcrypt.hash(password, 12);
    let userName = first_name + last_name;
    //user name validation
    let newUserName = await userNameValidation(userName);
    const user = await new User({
      first_name,
      last_name,
      username: newUserName,
      email,
      password: cryptedPassword,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();
    //emailverification
    const emailvarificationToken = genaretCode(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailvarificationToken}`;
    sendVerifactionEmail(user?.email, user?.first_name, url);
    const token = genaretCode({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      usrname: user?.username,
      picture: user?.picture,
      first_name: user?.first_name,
      last_name: user?.last_name,
      token: token,
      verified: user?.verified,
      messages:
        "User Created Successfully Please Check Your Email To Activate Your Account",
    });
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
};
exports.activateAccount = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const user = jwt.verify(token, process.env.SECRET_TOKEN);
    const check = await User.findById(user.id);
    if (validUser !== user.id) {
      return res.status(400).json({
        messages: "You Don't Have The Authorization to Complete The Opeeation",
      });
    }
    if (check.verified == true) {
      return res
        .status(400)
        .json({ messages: "This email is already activated" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ messages: "Account has beeen activated successfully" });
    }
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
};

//login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ messages: "The Email Address Doesn't Exits" });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({ messages: "The Password Is Incorrect" });
    }
    const token = genaretCode({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      usrname: user?.username,
      picture: user?.picture,
      first_name: user?.first_name,
      last_name: user?.last_name,
      token: token,
      verified: user?.verified,
    });
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
};
// Send Verification Again
exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res
        .status(400)
        .json({ messages: "This account is already verified" });
    }
    const emailvarificationToken = genaretCode(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailvarificationToken}`;
    sendVerifactionEmail(user?.email, user?.first_name, url);
    return res.status(200).json({
      messages: "Email Verification Link has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
};
exports.Userauth = async (req, res) => {
  res.json("Welcome To Auth");
};
exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        messages: "Acount does not Exists",
      });
    } else {
      return res.status(200).json({
        email: user.email,
        picture: user.picture,
      });
    }
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
};

// Reset Password Code
exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = genaretCodeReset(5);
    const SaveCode = await new Code({
      code,
      user: user._id,
    }).save();
    sendResetCode(user.email, user.first_name, code);
    return res.status(200).json({
      messages: "Email Reset Code Has Been Send To Your Email",
    });
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
};
exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const dbcode = await Code.findOne({ user: user._id });
    if (dbcode.code !== code) {
      return res.status(400).json({
        messages: "Code Does Not Valid",
      });
    }
    return res.status(200).json({
      messages: "ok",
    });
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
};
exports.changesPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cryptedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate(
      { email },
      {
        password: cryptedPassword,
      }
    );
    return res.status(200).json({
      messages: "ok",
    });
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
};
// -------get Profile Data----------
exports.getProfile=async(req,res)=>{
  try {
    const {username} = req.params
    const profile = await User.findById(req.user.id).select("-password")
    const user = await User.findOne({username}).select("-password")
    const friendShip = {
      friends:false,
      requestsent:false,
      following:false,
      requestRecived:false
    }
    if(!user || user === null){
      return res.send({
        messages: false
      })
    }
    if(profile.friends.includes(user._id)&&user.friends.includes(profile._id)){
        friendShip.friends = true
    }
    if(profile.following.includes(user._id)){
      friendShip.following = true
    }
    if(profile.requests.includes(user._id)){
       friendShip.requestRecived = true
    }
    if(user.requests.includes(profile._id)){
       friendShip.requestsent = true
    }
    const post = await Post.find({user: user._id}).populate("user", "-password").populate('comments.commentBy','first_name last_name picture username').sort({createdAt: -1})
    await user.populate("friends","first_name last_name username picture");
    return res.status(200).json({
      ...user.toObject(),
      post,
      messages:"ok",
      friendShip
    })
    
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.updateProfilePicture=async(req,res)=>{
  try {
    const {url} = req.body
    await User.findByIdAndUpdate(req.user.id, {picture: url})
    res.status(200).json({
      messages: "success",
      picture: url
    })
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.updateCover= async(req,res)=>{
  try {
    const {url} = req.body
    await User.findByIdAndUpdate(req.user.id, {cover: url})
    res.status(200).json({
      messages: "success",
      cover: url
    })
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.updateDetails= async(req,res)=>{
  try {
    const { infos } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.addFriend= async(req,res)=>{
  try {
    if(req.user.id !== req.params.id){
      const sender = await User.findById(req.user.id)
      const receiver = await User.findById(req.params.id)
      if(!receiver?.requests?.includes(sender._id) && !sender?.friends?.includes(receiver._id)){
        await receiver.updateOne({$push: {requests: sender._id}})
        await receiver.updateOne({$push: {followers: sender._id}})
        await sender.updateOne({$push: {following: receiver._id}})
        res.status(200).json({
          messages: "freind request has been sent"
        })
    }
    else{
      return res.status(400).json({
        messages: "You are Already Friends"
      })
    }
  }
    else{
      return res.status(400).json({
        messages: "You Can't Add Yourself"
      })
    }
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.cancelFriendRequest= async(req,res)=>{
  try {
    if(req.user.id !== req.params.id){
      const sender = await User.findById(req.user.id)
      const receiver = await User.findById(req.params.id)
      if(receiver?.requests?.includes(sender._id) && !sender?.friends?.includes(receiver._id)){
        await receiver.updateOne({$pull: {requests: sender._id}})
        await receiver.updateOne({$pull: {followers: sender._id}})
        await sender.updateOne({$pull: {following: receiver._id}})
        res.status(200).json({
          messages: "freind request been canceled"
        })
    }
    else{
      return res.status(400).json({
        messages: "You are Already Cancelled"
      })
    }
  }
    else{
      return res.status(400).json({
        messages: "You Can't Cancle Yourself"
      })
    }
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.follow= async(req,res)=>{
  try {
    if(req.user.id !== req.params.id){
      const sender = await User.findById(req.user.id)
      const receiver = await User.findById(req.params.id)
      if(!receiver?.followers?.includes(sender._id) && !sender?.following?.includes(receiver._id)){
        await receiver.updateOne({$push: {followers: sender._id}})
        await sender.updateOne({$push: {following: receiver._id}})
        res.status(200).json({
          messages: "You are Following"
        })
    }
    else{
      return res.status(400).json({
        messages: "You are Already Following"
      })
    }
  }
    else{
      return res.status(400).json({
        messages: "You Can't follow Yourself"
      })
    }
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.unfollow= async(req,res)=>{
  try {
    if(req.user.id !== req.params.id){
      const sender = await User.findById(req.user.id)
      const receiver = await User.findById(req.params.id)
      if(receiver?.followers?.includes(sender._id) && sender?.following?.includes(receiver._id)){
        await receiver.updateOne({$pull: {followers: sender._id}})
        await sender.updateOne({$pull: {following: receiver._id}})
        res.status(200).json({
          messages: "You are Unfollowed"
        })
    }
    else{
      return res.status(400).json({
        messages: "You are Already unfollowing"
      })
    }
  }
    else{
      return res.status(400).json({
        messages: "You Can't unfollow Yourself"
      })
    }
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.acceptFriendRequest= async(req,res)=>{
  try {
    if(req.user.id !== req.params.id){
      const  receiver= await User.findById(req.user.id)
      const sender = await User.findById(req.params.id)
      if(receiver?.requests?.includes(sender._id)){
        await receiver.update({$push: {friends: sender._id,following: sender._id}})
        await sender.update({$push: {friends: receiver._id,followers: receiver._id}})
        await receiver.updateOne({$pull: {requests: sender._id}})
        res.status(200).json({
          messages: "You are Friends"
        })
    }
    else{
      return res.status(400).json({
        messages: "You are Already accepted"
      })
    }
  }
    else{
      return res.status(400).json({
        messages: "You Can't accept Yourself"
      })
    }
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.unfriend= async(req,res)=>{
  try {
    if(req.user.id !== req.params.id){
      const  sender= await User.findById(req.user.id)
      const receiver = await User.findById(req.params.id)
      // console.log(sender?.friends?.includes(receiver._id))
      if(receiver?.friends?.includes(sender._id) && sender?.friends?.includes(receiver._id)){
        await receiver.update({$pull: {friends: sender._id,following: sender._id,followers: sender._id}})
        await sender.update({$pull: {friends: receiver._id,following: receiver._id,followers: receiver._id}}) 
        res.status(200).json({
          messages: "You are Unfriended"
        })
    }
    else{
      return res.status(400).json({
        messages: "You are Already Unfriended"
      })
    }
  }
    else{
      return res.status(400).json({
        messages: "You Can't unfriend Yourself"
      })
    }
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.deleteRequest= async(req,res)=>{
    try {
      if(req.user.id !== req.params.id){
        const  receiver= await User.findById(req.user.id)
        const sender = await User.findById(req.params.id)
        if(receiver?.requests?.includes(sender._id) ){
          await receiver.update({$pull: {requests: sender._id,followers: sender._id}}) 
          await sender.update({$pull: {following: receiver._id}}) 
          res.status(200).json({
            messages: "Dellete Request"
          })
      }
      else{
        return res.status(400).json({
          messages: "You are Already Dellete Request"
        })
      }
    }
      else{
        return res.status(400).json({
          messages: "You Can't delete Yourself"
        })
      }
    }
   catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.search= async(req,res)=>{
  try {
    const {searchTerm} = req.params
    const results = await User.find({$text: {$search: searchTerm}}).select('first_name last_name username picture').limit(10)
    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}
exports.friendPageinfo= async(req,res)=>{
  try {
    const user = await User.findById(req.user.id).select('friends requests').populate("friends","first_name last_name username picture").populate("requests","first_name last_name username picture")
    const sentRequests= await User.find({requests:mongoose.Types.ObjectId(req.user.id)}).select('first_name last_name username picture')
   res.status(200).json({
    friends: user?.friends,
    requests: user?.requests,
    sentRequests
   })
  } catch (error) {
    res.status(500).json({ messages: error?.messages });
  }
}