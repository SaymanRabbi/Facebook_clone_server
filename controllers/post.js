const Post = require('../Models/Post');
const User = require('../Models/User');
exports.createpost = async (req, res) => {
    try {
        const post = await new Post(req.body).save();
        res.status(200).json({
            messages: "Create Post Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            messages:error.message
        })
    }
}
exports.getAllPosts = async (req, res) => {
    try {
        const following = await User.findById(req.user.id).select('following');
        const posts = await Post.find({}).populate('user'
).populate('comments.commentBy','first_name last_name picture username').sort({createdAt:-1});
        res.status(200).json({
            messages: "Get All Posts Successfully",
            posts
        });
    } catch (error) {
        return res.status(500).json({
            messages:error.message
        })
    }
}
exports.comment = async (req, res) => {
    try {
        const {comment,postId,image} = req.body;
        let newComment = await Post.findByIdAndUpdate(postId,{
            $push:{comments:{comment,image,commentBy:req.user.id,commentAt:new Date()}}

        },{
            new:true
        }).populate('comments.commentBy','first_name last_name picture username');
        res.send({
            messages: "Comment Successfully",
            comment:newComment.comments
        })
    } catch (error) {
        return res.status(500).json({
            messages:error.message
        })
    }
}