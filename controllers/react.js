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
            console.log(reactNew);
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