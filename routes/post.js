const express = require("express");
const {
    createpost
} = require("../controllers/post");
const { authUser } = require("../Middlewers/auth");
const router = express.Router();
router.post("/createpost", authUser,createpost);
module.exports = router;
