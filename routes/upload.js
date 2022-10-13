const express = require("express");
const router = express.Router();
const {upload} = require("../controllers/upload");
const { authUser } = require("../Middlewers/auth");
const imagesauth = require("../Middlewers/imagesauth");
router.post("/upload",authUser,imagesauth,upload);
module.exports = router;
