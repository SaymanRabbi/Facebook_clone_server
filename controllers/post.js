const Post = require('../Models/Post');
const User = require('../Models/User');
// const { use } = require('../routes/post');
exports.createpost = async (req, res) => {
    try {
        const post = await new Post(req.body).save();
        await post.populate('user','first_name last_name picture username cover');
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
        const followingtemp = await User.findById(req.user.id).select('following');
        // console.log(followingtemp)
        const following = followingtemp.following;
        const promises = following.map(async(user) => {
            return await Post.find({user:user}).populate('user','first_name last_name picture username cover').populate('comments.commentBy','first_name last_name picture username').sort({createdAt:-1}).limit(10);
        });
        const followingPoststemp = await Promise.all(promises);
        const followingPosts = followingPoststemp.flat();
        const posts = await Post.find({user:req.user.id}).sort({createdAt:-1}).populate('user','first_name last_name picture username cover').populate('comments.commentBy','first_name last_name picture username').sort({createdAt:-1}).limit(10);
        posts.push(...[...followingPosts]);
        posts.sort((a,b) => b.createdAt - a.createdAt);
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
exports.savepost = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(req.user.id);
        const isSaved = user.savedPosts.find((post) => post.post.toString() == id);
        if(isSaved){
            await User.findByIdAndUpdate(req.user.id,{
                $pull:{savedPosts:{_id:isSaved._id},
            }
            })
        }
        else{
            await User.findByIdAndUpdate(req.user.id,{
                $push:{savedPosts:{post:id},
                dasavedAt:new Date()
            }
            })
        }
    } catch (error) {
        return res.status(500).json({
            messages:error.message
        })
    }
}
exports.deletepost = async (req, res) => {
    try {
        const {id} = req.params;
        await Post.findByIdAndRemove(id);
        res.status(200).json({
            messages: "Delete Post Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            messages:error.message
        })
    }
}