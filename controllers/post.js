const Post = require('../Models/Post');
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
        const posts = await Post.find({}).populate('user'
).sort({createdAt:-1});
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
            $push:{comments:{comment,image,commentBy:req.user.id}}

        },{
            new:true
        })
    } catch (error) {
        return res.status(500).json({
            messages:error.message
        })
    }
}