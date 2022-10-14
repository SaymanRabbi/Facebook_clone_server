const express = require("express");
const {
    createpost,
    getAllPosts
} = require("../controllers/post");
const { authUser } = require("../Middlewers/auth");
const router = express.Router();
router.post("/createpost", authUser,createpost);
router.get("/posts", authUser,getAllPosts);
module.exports = router;
