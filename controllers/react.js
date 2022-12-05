const React = require("../Models/React");
const mongoose = require("mongoose");
exports.reactPost = async (req, res) => {
    try {
        const { react, postRef } = req.body;
        const cheack = await React.findOne({
            postRef,
            userRef: mongoose.Types.ObjectId(req?.user?.id),
        })
        if (cheack==null) {
            const react = new React({
                react,
                postRef,
                userRef: req?.user?.id,
            });
            await react.save();
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
        }

    } catch (error) {
       
        res.status(500).json({  messages:error.message});
        
    }
}