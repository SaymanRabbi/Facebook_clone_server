const express = require("express");
const {
    createpost,
    getAllPosts,
    comment,
    savepost,
    deletepost
} = require("../controllers/post");
const { authUser } = require("../Middlewers/auth");
const router = express.Router();
router.post("/createpost", authUser,createpost);
router.get("/posts", authUser,getAllPosts);
router.put('/comment',authUser,comment)
router.put('/savepost/:id',authUser,savepost)
router.put('/deletepost/:id',authUser,deletepost)
module.exports = router;
