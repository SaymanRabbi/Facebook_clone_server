const Post = require('../models/post');
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