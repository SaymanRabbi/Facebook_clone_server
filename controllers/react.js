const React = require("../Models/React");
const mongoose = require("mongoose");
exports.reactPost = async (req, res) => {
    
    try {
        const { react, postRef } = req.body;
        
        const cheack = await React.findOne({
            postRef: postRef,
            userRef: mongoose.Types.ObjectId(req?.user?.id),
        })
        if (cheack==null) {
            const reactNew =new React({
                react: react,
                postRef:postRef,
                userRef: req?.user?.id,
            })
            await reactNew.save();
            res.status(200).json({
                message: "Reacted",
            });
        }
        else {
            if(cheack.react==react){
                await React.findByIdAndDelete(cheack._id);
                res.status(200).json({
                    message: "Unreacted",
                });
            }
            else{
                await React.findByIdAndUpdate(cheack._id,{react});
                res.status(200).json({
                    message: "Reacted",
                });
            }
        }

    } catch (error) {
        res.status(500).json({  messages:error.message});
        
    }
}
exports.getReact=async (req, res) => {
try {
    const {id} = req.params;
        const Reactarray = await React.find({postRef:id});
        // console.log(Reactarray);
        const newReacts = Reactarray.reduce((group, react) => {
            let key = react["react"];
            group[key] = group[key] || [];
            group[key].push(react);
            return group;
          }, {});
            // console.log(newReacts);
const reacts = [
    {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
]
        const cheack = await React.findOne({
            postRef: id,
            userRef: req?.user?.id,
        })
        // console.log(cheack);
        res.status(200).json({reacts,cheack:cheack,total:Reactarray.length});
} catch (error) {
    res.status(500).json({  messages:error.message});
}
}